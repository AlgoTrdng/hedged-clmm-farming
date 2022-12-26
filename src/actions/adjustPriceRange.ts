import { decreaseLiquidityQuoteByLiquidityWithParams, WhirlpoolData } from '@orca-so/whirlpools-sdk'
import { AddressLookupTableAccount, TransactionInstruction } from '@solana/web3.js'
import { buildAndSignTxFromInstructions, sendTransaction } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { connection, tokenA, tokenB, wallet } from '../global.js'
import { buildCloseWhirlpoolPositionIxs } from '../instructions/closeWhirlpoolPosition.js'
import { buildOpenWhirlpoolPositionIx } from '../instructions/openWhirlpoolPosition.js'
import { fetchBestRoute } from '../services/jupiter/fetchBestRoute.js'
import { fetchJupiterInstructions } from '../services/jupiter/transaction.js'
import { getWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import {
	getBoundariesPricesFromPrice,
	getPriceFromSqrtPrice,
} from '../services/orca/helpers/getPriceWithBoundaries.js'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { WhirlpoolPosition } from '../state.js'

type AdjustPriceRangeParams = {
	whirlpoolPosition: WhirlpoolPosition
	whirlpoolData: WhirlpoolData
	currentPrice: number
}

export const adjustPriceRange = async ({
	whirlpoolPosition,
	whirlpoolData,
	currentPrice,
}: AdjustPriceRangeParams): Promise<WhirlpoolPosition> => {
	const ALTAccountPromise = loadALTAccount()
	const decreaseLiquidityQuote = decreaseLiquidityQuoteByLiquidityWithParams({
		liquidity: whirlpoolPosition.liquidity,
		slippageTolerance: SLIPPAGE_TOLERANCE,
		sqrtPrice: whirlpoolData.sqrtPrice,
		tickCurrentIndex: whirlpoolData.tickCurrentIndex,
		tickLowerIndex: whirlpoolPosition.tickLowerIndex,
		tickUpperIndex: whirlpoolPosition.tickUpperIndex,
	})

	const { outAmount: withdrawnTokenAAsTokenBAmount } = await fetchBestRoute({
		inputMint: tokenA.mint,
		outputMint: tokenB.mint,
		amountRaw: decreaseLiquidityQuote.tokenEstA.toNumber(),
		swapMode: 'ExactIn',
	})

	const { instructions: closeWhirlpoolPositionIxs, withdrawAmounts } =
		buildCloseWhirlpoolPositionIxs({
			whirlpoolData,
			whirlpoolPosition: whirlpoolPosition,
			decreaseLiquidityQuote,
		})

	const totalTokenBAmount = withdrawAmounts.tokenB + Number(withdrawnTokenAAsTokenBAmount)
	const boundaries = getBoundariesPricesFromPrice(currentPrice)

	const {
		instructions: openWhirlpoolPositionIxs,
		additionalSigners,
		depositAmounts,
		...adjustedWhirlpoolPosition
	} = await buildOpenWhirlpoolPositionIx({
		amountRaw: totalTokenBAmount,
		whirlpoolData,
		...boundaries,
	})

	const swapInstructions: TransactionInstruction[] = []
	const ALTAccounts: AddressLookupTableAccount[] = []

	const tokenBDiff = depositAmounts.tokenB - withdrawAmounts.tokenB
	const tokenADiff = depositAmounts.tokenA - withdrawAmounts.tokenA
	if (tokenBDiff > 0) {
		// need to swap SOL to USDC
		const { instructions, ATLAccounts: _ATLAccounts } = await fetchJupiterInstructions({
			swapMode: 'ExactOut',
			inputMint: tokenA.mint,
			outputMint: tokenB.mint,
			unwrapSol: false,
			amountRaw: tokenBDiff,
		})
		swapInstructions.push(...instructions)
		ALTAccounts.push(..._ATLAccounts)
	} else if (tokenADiff > 0) {
		// need to swap USDC to SOL
		const { instructions, ATLAccounts: _ATLAccounts } = await fetchJupiterInstructions({
			swapMode: 'ExactOut',
			inputMint: tokenB.mint,
			outputMint: tokenA.mint,
			unwrapSol: false,
			amountRaw: tokenADiff,
		})
		swapInstructions.push(...instructions)
		ALTAccounts.push(..._ATLAccounts)
	}

	const ALTAccount = await ALTAccountPromise
	const txData = await buildAndSignTxFromInstructions(
		{
			signers: [wallet, ...additionalSigners],
			instructions: [
				...closeWhirlpoolPositionIxs,
				...swapInstructions,
				...openWhirlpoolPositionIxs,
			],
			addressLookupTables: [ALTAccount, ...ALTAccounts],
		},
		connection,
	)

	while (true) {
		const res = await sendTransaction(
			{
				...txData,
				connection,
			},
			{ log: true },
		)
		switch (res.status) {
			case 'SUCCESS': {
				return adjustedWhirlpoolPosition
			}
			case 'BLOCK_HEIGHT_EXCEEDED':
			case 'ERROR': {
				const _whirlpoolData = await getWhirlpoolData()
				return adjustPriceRange({
					whirlpoolPosition: whirlpoolPosition,
					whirlpoolData: _whirlpoolData,
					currentPrice: getPriceFromSqrtPrice(_whirlpoolData.sqrtPrice),
				})
			}
		}
		await setTimeout(500)
	}
}
