import { TransactionInstruction } from '@solana/web3.js'
import { ParsableWhirlpool, PoolUtil, PriceMath } from '@orca-so/whirlpools-sdk'
import { setTimeout } from 'node:timers/promises'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { buildAndSignTxFromInstructions, sendTransaction } from 'solana-tx-utils'

import { getWhirlpoolData } from './services/orca/getWhirlpoolData.js'
import { connection, fetcher, tokenA, tokenB, wallet } from './global.js'
import { USDC_POSITION_SIZE, WHIRLPOOL_ADDRESS } from './config.js'
import { openHedgedPosition } from './actions/openHedgedPosition.js'
import { getPriceWithBoundaries } from './services/orca/helpers/getPriceWithBoundaries.js'
import { State } from './types.js'
import { retryOnThrow } from './utils/retryOnThrow.js'
import { buildDriftInitializeUserIx } from './services/drift/instructions/initializeUser.js'
import { forceSendTx } from './utils/forceSendTx.js'

/* ---- SETUP ---- */
await (async () => {
	const instructions: TransactionInstruction[] = []

	const setupDriftIxs = await buildDriftInitializeUserIx()
	instructions.push(...setupDriftIxs)

	const wSolATAccount = await retryOnThrow(() => connection.getAccountInfo(tokenA.ATAddress))
	if (!wSolATAccount?.data) {
		instructions.push(
			createAssociatedTokenAccountInstruction(
				wallet.publicKey,
				tokenA.ATAddress,
				wallet.publicKey,
				tokenA.mint,
			),
		)
	}

	if (instructions.length) {
		console.log('INITIALIZING')
		await forceSendTx(() =>
			buildAndSignTxFromInstructions(
				{
					signers: [wallet],
					instructions,
				},
				connection,
			),
		)
	}
})()

const state: State = {
	whirlpool: null,
}

await (async () => {
	const whirlpoolData = await getWhirlpoolData()
	const { price, upperBoundaryPrice, lowerBoundaryPrice } = getPriceWithBoundaries(
		whirlpoolData.sqrtPrice,
	)
	const whirlpoolPosition = await openHedgedPosition({
		usdcAmountRaw: USDC_POSITION_SIZE * 10 ** 6,
		upperBoundaryPrice,
		lowerBoundaryPrice,
	})
	state.whirlpool = {
		price,
		upperBoundaryPrice,
		lowerBoundaryPrice,
		position: whirlpoolPosition,
	}
})()

console.log(state)

/*
  HEDGE RE-BALANCING
  - keep track of pool price
    - if price is > last_price
      - repay the difference in SOL liquidity between prev and current
    - if price < last_price
      - borrow the difference in SOL

  PRICE RANGE ADJUSTING
  - if price reaches 80% of the price range
    - close position
    - open position with new price range
    - borrow or repay SOL difference between prev and current position
*/

/* eslint-disable @typescript-eslint/no-non-null-assertion */
// const UPDATE_TIMEOUT = 30_000
// let lastUpdate = 0

// let lastPrice = state.whirlpool!.price

// connection.onAccountChange(WHIRLPOOL_ADDRESS, async (ai) => {
// 	const whirlpoolData = ParsableWhirlpool.parse(ai.data)
// 	if (!whirlpoolData) {
// 		return
// 	}
// 	const price = PriceMath.sqrtPriceX64ToPrice(
// 		whirlpoolData.sqrtPrice,
// 		tokenA.decimals,
// 		tokenB.decimals,
// 	).toNumber()

// 	if (price === lastPrice || lastUpdate + UPDATE_TIMEOUT > new Date().getTime()) {
// 		return
// 	}

// 	const position = await retryOnThrow(() =>
// 		fetcher.getPosition(state.whirlpool!.position.PDAddress),
// 	)
// 	if (!position) {
// 		return
// 	}

// 	const lowerBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(position.tickLowerIndex)
// 	const upperBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(position.tickUpperIndex)

// 	const { tokenA: tokenAAmount } = PoolUtil.getTokenAmountsFromLiquidity(
// 		position.liquidity,
// 		whirlpoolData.sqrtPrice,
// 		lowerBoundarySqrtPrice,
// 		upperBoundarySqrtPrice,
// 		false,
// 	)

// 	console.log(tokenAAmount.toNumber())

// 	lastPrice = price
// 	lastUpdate = new Date().getTime()
// })
