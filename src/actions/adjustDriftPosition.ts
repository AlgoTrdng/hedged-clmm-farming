import { PriceMath, PoolUtil } from '@orca-so/whirlpools-sdk'
import { AddressLookupTableAccount, TransactionInstruction } from '@solana/web3.js'
import { buildAndSignTxFromInstructions, sendTransaction } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'
import BN from 'bn.js'

import { connection, tokenA, tokenB, wallet } from '../global.js'
import { buildDriftDepositIx } from '../services/drift/instructions/deposit.js'
import { buildDriftWithdrawIx } from '../services/drift/instructions/withdraw.js'
import { fetchJupiterInstructions } from '../services/jupiter/transaction.js'
import { fetchWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { DriftPosition, WhirlpoolPosition } from '../state.js'

type AdjustHedgePositionParams = {
	driftPosition: DriftPosition
	whirlpoolPositionData: Pick<WhirlpoolPosition, 'liquidity' | 'tickLowerIndex' | 'tickUpperIndex'>
	whirlpoolSqrtPrice?: BN
}

export const adjustDriftPosition = async ({
	driftPosition,
	whirlpoolPositionData,
	whirlpoolSqrtPrice,
}: AdjustHedgePositionParams): Promise<DriftPosition> => {
	const sqrtPrice =
		whirlpoolSqrtPrice !== undefined ? whirlpoolSqrtPrice : (await fetchWhirlpoolData()).sqrtPrice
	const ALTAccountPromise = loadALTAccount()

	const { liquidity, tickLowerIndex, tickUpperIndex } = whirlpoolPositionData

	const lowerBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex)
	const upperBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex)
	const whirlpoolPositionBalances = PoolUtil.getTokenAmountsFromLiquidity(
		liquidity,
		sqrtPrice,
		lowerBoundarySqrtPrice,
		upperBoundarySqrtPrice,
		false,
	)
	const tokenADiff = whirlpoolPositionBalances.tokenA.toNumber() - driftPosition.borrowAmount

	const instructions: TransactionInstruction[] = []
	const ALTAccounts: AddressLookupTableAccount[] = []

	const adjustedDriftPosition: DriftPosition = driftPosition

	if (tokenADiff > 0) {
		// Position tokenA is bigger than hedged tokenA, borrow diff
		adjustedDriftPosition.borrowAmount += tokenADiff

		const borrowIx = buildDriftWithdrawIx({
			amountRaw: tokenADiff,
			token: tokenA,
			borrow: true,
		})
		const { instructions: swapIxs, ATLAccounts: swapATLAccounts } = await fetchJupiterInstructions({
			inputMint: tokenA.mint,
			outputMint: tokenB.mint,
			unwrapSol: false,
			swapMode: 'ExactIn',
			amountRaw: tokenADiff,
		})
		instructions.push(borrowIx, ...swapIxs)
		ALTAccounts.push(...swapATLAccounts)
	} else if (tokenADiff < 0) {
		// Position tokenA is lower than hedged tokenA, repay diff
		const amount = Math.abs(tokenADiff)
		adjustedDriftPosition.borrowAmount -= amount

		const { instructions: swapIxs, ATLAccounts: swapATLAccounts } = await fetchJupiterInstructions({
			inputMint: tokenB.mint,
			outputMint: tokenA.mint,
			unwrapSol: false,
			swapMode: 'ExactOut',
			amountRaw: amount,
		})
		const repayIx = buildDriftDepositIx({
			amountRaw: amount,
			token: tokenA,
			repay: true,
		})
		instructions.push(...swapIxs, repayIx)
		ALTAccounts.push(...swapATLAccounts)
	}

	if (!instructions.length) {
		return driftPosition
	}

	const ALTAccount = await ALTAccountPromise
	const txData = await buildAndSignTxFromInstructions(
		{
			instructions,
			signers: [wallet],
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
				return adjustedDriftPosition
			}
			case 'BLOCK_HEIGHT_EXCEEDED':
			case 'ERROR': {
				if (res.error) {
					console.log(res.error.error)
				}
				return adjustDriftPosition({
					driftPosition,
					whirlpoolPositionData,
				})
			}
		}
		await setTimeout(500)
	}
}
