import { buildAndSignTxFromInstructions } from 'solana-tx-utils'
import { ORCA_WHIRLPOOL_PROGRAM_ID, WhirlpoolData } from '@orca-so/whirlpools-sdk'

import { connection, tokenA, tokenB, surfWallet } from '../global.js'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { buildDriftDepositIx } from '../services/drift/instructions/deposit.js'
import { buildDriftWithdrawIx } from '../services/drift/instructions/withdraw.js'
import { buildOpenWhirlpoolPositionIx } from '../instructions/openWhirlpoolPosition.js'
import { executeJupiterSwap } from '../services/jupiter/swap.js'
import { DriftPosition, WhirlpoolPosition } from '../state.js'
import { buildSwapIx } from '../services/orca/instructions/swap.js'
import { fetchWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { buildPriorityFeeIxs } from '../instructions/priorityFee.js'
import { sendTransactionWrapper } from '../utils/sendTransactionWrapper.js'

type OpenHedgedPositionParams = {
	usdcAmountRaw: number
	upperBoundaryPrice: number
	lowerBoundaryPrice: number
	whirlpoolData?: WhirlpoolData
}

type HedgedPosition = {
	whirlpoolPosition: WhirlpoolPosition
	driftPosition: DriftPosition
}

export const openHedgedPosition = async ({
	usdcAmountRaw,
	upperBoundaryPrice,
	lowerBoundaryPrice,
	whirlpoolData,
}: OpenHedgedPositionParams): Promise<HedgedPosition> => {
	const safeInputAmountRaw = usdcAmountRaw - 500_000
	const orcaAmount = Math.floor(safeInputAmountRaw * 0.5)
	const collateralAmount = safeInputAmountRaw - orcaAmount

	const _whirlpoolData = whirlpoolData || (await fetchWhirlpoolData())

	// Deposit to Orca
	const {
		instructions: openWhirlpoolPositionIxs,
		additionalSigners,
		depositAmounts,
		...whirlpoolPosition
	} = await buildOpenWhirlpoolPositionIx({
		whirlpoolData: _whirlpoolData,
		amountRaw: orcaAmount,
		upperBoundaryPrice,
		lowerBoundaryPrice,
	})

	// Swap USDC to SOL
	const prepareDepositAmountIx = await buildSwapIx({
		amount: depositAmounts.tokenA,
		mode: 'ExactOut',
	})

	// Deposit to DRIFT
	const depositUsdcToDrift = buildDriftDepositIx({
		amountRaw: collateralAmount,
		token: tokenB,
		repay: false,
	})
	const borrowSolFromDrift = buildDriftWithdrawIx({
		amountRaw: depositAmounts.tokenA,
		token: tokenA,
		borrow: true,
	})

	const ALTAccount = await loadALTAccount()
	const txData = await buildAndSignTxFromInstructions(
		{
			payerKey: surfWallet.publicKey,
			signers: [surfWallet, ...additionalSigners],
			addressLookupTables: [ALTAccount],
			instructions: [
				...buildPriorityFeeIxs({
					units: 450000,
				}),
				prepareDepositAmountIx,
				...openWhirlpoolPositionIxs,
				depositUsdcToDrift,
				borrowSolFromDrift,
			],
		},
		connection,
	)

	while (true) {
		const depositLiquidityAndBorrowRes = await sendTransactionWrapper(txData)
		if (depositLiquidityAndBorrowRes.status === 'SUCCESS') {
			console.log(
				'Whirlpool position balances:\n',
				`TokenA: ${depositAmounts.tokenA}\n`,
				`TokenB: ${depositAmounts.tokenB}\n`,
			)
			break
		}
		if (
			depositLiquidityAndBorrowRes.status === 'BLOCK_HEIGHT_EXCEEDED' ||
			(depositLiquidityAndBorrowRes.error?.programId?.equals(ORCA_WHIRLPOOL_PROGRAM_ID) &&
				(depositLiquidityAndBorrowRes.error.error === 0x1781 ||
					depositLiquidityAndBorrowRes.error.error === 0x1 ||
					depositLiquidityAndBorrowRes.error.error === 0x1787))
		) {
			return openHedgedPosition({
				usdcAmountRaw,
				upperBoundaryPrice,
				lowerBoundaryPrice,
			})
		}
	}

	// Sell borrowed SOL
	await executeJupiterSwap({
		inputMint: tokenA.mint,
		outputMint: tokenB.mint,
		swapMode: 'ExactIn',
		amountRaw: depositAmounts.tokenA,
		unwrapSol: false,
	})

	return {
		driftPosition: {
			collateralAmount,
			borrowAmount: depositAmounts.tokenA,
		},
		whirlpoolPosition,
	}
}
