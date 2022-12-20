import { sendTransaction, buildAndSignTxFromInstructions } from 'solana-tx-utils'
import {
	increaseLiquidityQuoteByInputTokenWithParams,
	ORCA_WHIRLPOOL_PROGRAM_ID,
} from '@orca-so/whirlpools-sdk'
import { BN } from 'bn.js'

import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { connection, tokenA, tokenB, wallet } from '../global.js'
import { buildInitTickArrayIx } from '../orca/instructions/initTickArray.js'
import { getBoundariesTickIndexes } from '../orca/getBoundariesTickIndex.js'
import { getWhirlpoolData } from '../orca/pool.js'
import { buildCreatePositionIx } from '../orca/instructions/createPosition.js'
import { buildDepositLiquidityIx } from '../orca/instructions/depositLiquidity.js'
import { retryOnThrow } from '../utils/retryOnThrow.js'
import { buildDepositUsdcToSolendIx } from '../solend/instructions/depositUsdc.js'
import { buildBorrowSolFromSolendIx } from '../solend/instructions/borrowSol.js'
import { ALT_ADDRESS } from '../config.js'
import { fetchJupiterInstructions } from '../jupiter/transaction.js'
import { executeJupiterSwap } from '../jupiter/swap.js'
import { createCloseAccountInstruction } from '@solana/spl-token'

type OpenHedgedPositionParams = {
	usdcAmountRaw: number
	upperBoundaryPrice: number
	lowerBoundaryPrice: number
}

export const openHedgedPosition = async ({
	usdcAmountRaw,
	upperBoundaryPrice,
	lowerBoundaryPrice,
}: OpenHedgedPositionParams): Promise<void> => {
	const orcaAmount = Math.floor(usdcAmountRaw * 0.55)
	const solendAmount = usdcAmountRaw - orcaAmount

	console.log({ orcaAmount, solendAmount })

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

	const altAccountInfo = await retryOnThrow(() => connection.getAddressLookupTable(ALT_ADDRESS))
	if (!altAccountInfo.value) {
		throw Error(`ALT: ${ALT_ADDRESS.toString()} does not exist`)
	}

	const tx = await buildAndSignTxFromInstructions(
		{
			payerKey: wallet.publicKey,
			signers: [wallet, ...signers],
			addressLookupTables: [altAccountInfo.value, ...ATLAccounts],
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
		console.log(depositLiquidityAndBorrowRes)
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
}
