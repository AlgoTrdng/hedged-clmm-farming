import { sendTransaction, buildAndSignTxFromInstructions } from 'solana-tx-utils'
import {
	increaseLiquidityQuoteByInputTokenWithParams,
	ORCA_WHIRLPOOL_PROGRAM_ID,
} from '@orca-so/whirlpools-sdk'
import { BN } from 'bn.js'

import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { connection, tokenA, tokenB, wallet } from '../global.js'
import { buildInitTickArrayIx } from '../services/orca/instructions/initTickArray.js'
import { getBoundariesTickIndexes } from '../services/orca/helpers/getBoundariesTickIndex.js'
import { getWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { buildCreatePositionIx } from '../services/orca/instructions/createPosition.js'
import { buildDepositLiquidityIx } from '../services/orca/instructions/depositLiquidity.js'
import { buildDepositUsdcToSolendIx } from '../solend/instructions/depositUsdc.js'
import { buildBorrowSolFromSolendIx } from '../solend/instructions/borrowSol.js'
import { fetchJupiterInstructions } from '../services/jupiter/transaction.js'
import { executeJupiterSwap } from '../services/jupiter/swap.js'
import { createCloseAccountInstruction } from '@solana/spl-token'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { SavedWhirlpoolPosition } from '../types.js'

type OpenHedgedPositionParams = {
	usdcAmountRaw: number
	upperBoundaryPrice: number
	lowerBoundaryPrice: number
}

export const openHedgedPosition = async ({
	usdcAmountRaw,
	upperBoundaryPrice,
	lowerBoundaryPrice,
}: OpenHedgedPositionParams): Promise<SavedWhirlpoolPosition> => {
	const orcaAmount = Math.floor(usdcAmountRaw * 0.55)
	const solendAmount = usdcAmountRaw - orcaAmount

	const whirlpoolData = await getWhirlpoolData()

	const { tickLowerIndex, tickUpperIndex } = getBoundariesTickIndexes({
		tickSpacing: whirlpoolData.tickSpacing,
		upperBoundary: upperBoundaryPrice,
		lowerBoundary: lowerBoundaryPrice,
	})
	const liquidityInput = increaseLiquidityQuoteByInputTokenWithParams({
		inputTokenMint: tokenB.mint,
		inputTokenAmount: new BN(orcaAmount * 0.5),
		slippageTolerance: SLIPPAGE_TOLERANCE,
		tickLowerIndex,
		tickUpperIndex,
		...whirlpoolData,
	})

	// Swap USDC to SOL
	const { instructions, ATLAccounts } = await fetchJupiterInstructions({
		inputMint: tokenB.mint,
		outputMint: tokenA.mint,
		amountRaw: liquidityInput.tokenEstA.toNumber(),
		swapMode: 'ExactOut',
		unwrapSol: false,
	})

	// Deposit to ORCA
	const initTickArrayIxs = await buildInitTickArrayIx(whirlpoolData)
	const {
		position,
		instruction: createPositionIx,
		signers,
	} = buildCreatePositionIx({
		tickLowerIndex,
		tickUpperIndex,
	})
	const depositLiquidityIxs = buildDepositLiquidityIx({
		positionATAddress: position.ATAddress,
		positionPDAddress: position.PDAddress,
		whirlpoolData,
		tickLowerIndex,
		tickUpperIndex,
		liquidityInput,
	})

	// Deposit to SOLEND
	const depositUsdcToSolendIx = await buildDepositUsdcToSolendIx(solendAmount)
	const borrowSolFromSolendIx = buildBorrowSolFromSolendIx(liquidityInput.tokenEstA)

	const closeWrappedSolIx = createCloseAccountInstruction(
		tokenA.ATAddress,
		wallet.publicKey,
		wallet.publicKey,
	)

	instructions.push(
		...initTickArrayIxs,
		createPositionIx,
		...depositLiquidityIxs,
		...depositUsdcToSolendIx,
		...borrowSolFromSolendIx,
		closeWrappedSolIx,
	)

	const ALTAccount = await loadALTAccount()
	const tx = await buildAndSignTxFromInstructions(
		{
			payerKey: wallet.publicKey,
			signers: [wallet, ...signers],
			addressLookupTables: [ALTAccount, ...ATLAccounts],
			instructions,
		},
		connection,
	)

	while (true) {
		const depositLiquidityAndBorrowRes = await sendTransaction(
			{
				...tx,
				connection,
			},
			{ log: true },
		)
		if (depositLiquidityAndBorrowRes.status === 'SUCCESS') {
			break
		}
		if (
			depositLiquidityAndBorrowRes.status === 'BLOCK_HEIGHT_EXCEEDED' ||
			(depositLiquidityAndBorrowRes.error?.programId?.equals(ORCA_WHIRLPOOL_PROGRAM_ID) &&
				depositLiquidityAndBorrowRes.error.error === 0x1781)
		) {
			return openHedgedPosition({
				usdcAmountRaw,
				upperBoundaryPrice,
				lowerBoundaryPrice,
			})
		}
	}

	// Swap borrowed SOL for USDC
	await executeJupiterSwap({
		inputMint: tokenA.mint,
		outputMint: tokenB.mint,
		swapMode: 'ExactIn',
		amountRaw: liquidityInput.tokenEstA,
	})

	return position
}
