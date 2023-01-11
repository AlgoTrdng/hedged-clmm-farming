import { decreaseLiquidityQuoteByLiquidityWithParams, WhirlpoolData } from '@orca-so/whirlpools-sdk'
import { ConfirmedTransactionMeta } from '@solana/web3.js'
import { buildAndSignTxFromInstructions, sendTransaction } from 'solana-tx-utils'
import { createCloseAccountInstruction } from '@solana/spl-token'
import { setTimeout } from 'node:timers/promises'

import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { connection, surfWallet, tokenA, tokenB } from '../global.js'
import { buildCloseWhirlpoolPositionIxs } from '../instructions/closeWhirlpoolPosition.js'
import { getDriftTokenAmounts } from '../services/drift/getTokenAmount.js'
import { buildDriftDepositIx } from '../services/drift/instructions/deposit.js'
import { buildDriftWithdrawIx } from '../services/drift/instructions/withdraw.js'
import { fetchWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { buildSwapIx } from '../services/orca/instructions/swap.js'
import { state } from '../state.js'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { buildPriorityFeeIxs } from '../instructions/priorityFee.js'

export const closeHedgedPosition = async (
	whirlpoolData?: WhirlpoolData,
): Promise<ConfirmedTransactionMeta> => {
	const ALTAccountPromise = loadALTAccount()
	const _whirlpoolData = whirlpoolData || (await fetchWhirlpoolData())
	const { whirlpoolPosition } = state

	const decreaseLiquidityQuote = decreaseLiquidityQuoteByLiquidityWithParams({
		liquidity: whirlpoolPosition.liquidity,
		slippageTolerance: SLIPPAGE_TOLERANCE,
		sqrtPrice: _whirlpoolData.sqrtPrice,
		tickCurrentIndex: _whirlpoolData.tickCurrentIndex,
		tickLowerIndex: whirlpoolPosition.tickLowerIndex,
		tickUpperIndex: whirlpoolPosition.tickUpperIndex,
	})
	const { instructions, withdrawAmounts } = buildCloseWhirlpoolPositionIxs({
		whirlpoolData: _whirlpoolData,
		whirlpoolPosition,
		decreaseLiquidityQuote,
	})

	const { tokenA: tokenABorrowedAmount, tokenB: tokenBSuppliedAmount } =
		await getDriftTokenAmounts()

	const tokenADiff = withdrawAmounts.tokenA - tokenABorrowedAmount
	if (tokenADiff - 100_000 < 0) {
		const swapIx = await buildSwapIx({
			outAmount: Math.abs(tokenADiff) + 100_000,
			aToB: false,
		})
		instructions.push(swapIx)
	}
	const repayIx = buildDriftDepositIx({
		amountRaw: tokenABorrowedAmount + 100_000,
		token: tokenA,
		repay: true,
	})

	const withdrawIx = buildDriftWithdrawIx({
		amountRaw: tokenBSuppliedAmount,
		token: tokenB,
		borrow: false,
	})

	const closeWSolAccountIx = createCloseAccountInstruction(
		tokenA.ATAddress,
		surfWallet.publicKey,
		surfWallet.publicKey,
	)

	const txData = await buildAndSignTxFromInstructions(
		{
			signers: [surfWallet],
			instructions: [
				...buildPriorityFeeIxs({
					units: 300000,
				}),
				...instructions,
				repayIx,
				withdrawIx,
				closeWSolAccountIx,
			],
			addressLookupTables: [await ALTAccountPromise],
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
		if (res.status === 'SUCCESS') {
			return res.data
		}
		if (res.status === 'ERROR' || res.status === 'BLOCK_HEIGHT_EXCEEDED') {
			return closeHedgedPosition()
		}
		await setTimeout(500)
	}
}
