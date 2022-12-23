import { ParsableWhirlpool, PoolUtil, PriceMath } from '@orca-so/whirlpools-sdk'

import { getWhirlpoolData } from './services/orca/getWhirlpoolData.js'
import { connection, fetcher, tokenA, tokenB } from './global.js'
import { USDC_POSITION_SIZE, WHIRLPOOL_ADDRESS } from './config.js'
import { openHedgedPosition } from './actions/openHedgedPosition.js'
import { getPriceWithBoundaries } from './services/orca/helpers/getPriceWithBoundaries.js'
import { State } from './types.js'
import { retryOnThrow } from './utils/retryOnThrow.js'

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
const UPDATE_TIMEOUT = 30_000
let lastUpdate = 0

let lastPrice = state.whirlpool!.price

connection.onAccountChange(WHIRLPOOL_ADDRESS, async (ai) => {
	const whirlpoolData = ParsableWhirlpool.parse(ai.data)
	if (!whirlpoolData) {
		return
	}
	const price = PriceMath.sqrtPriceX64ToPrice(
		whirlpoolData.sqrtPrice,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()

	if (price === lastPrice || lastUpdate + UPDATE_TIMEOUT > new Date().getTime()) {
		return
	}

	const position = await retryOnThrow(() =>
		fetcher.getPosition(state.whirlpool!.position.PDAddress),
	)
	if (!position) {
		return
	}

	const lowerBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(position.tickLowerIndex)
	const upperBoundarySqrtPrice = PriceMath.tickIndexToSqrtPriceX64(position.tickUpperIndex)

	const { tokenA: tokenAAmount } = PoolUtil.getTokenAmountsFromLiquidity(
		position.liquidity,
		whirlpoolData.sqrtPrice,
		lowerBoundarySqrtPrice,
		upperBoundarySqrtPrice,
		false,
	)

  console.log(tokenAAmount.toNumber())

	lastPrice = price
	lastUpdate = new Date().getTime()
})
