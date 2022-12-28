import {
	WhirlpoolData,
	increaseLiquidityQuoteByInputTokenWithParams,
} from '@orca-so/whirlpools-sdk'
import BN from 'bn.js'

import { SLIPPAGE_TOLERANCE } from '../../../constants.js'
import { tokenB, tokenA } from '../../../global.js'
import { getPriceFromSqrtPrice } from './priceHelpers.js'

const round = (x: number, decimals: number) => Math.floor(x * 10 ** decimals) / 10 ** decimals

type GetWhirlpoolTokenBWeightParams = Pick<WhirlpoolData, 'sqrtPrice' | 'tickCurrentIndex'> & {
	upperTickIndex: number
	lowerTickIndex: number
}

export const getTokenBWeight = ({
	sqrtPrice,
	tickCurrentIndex,
	upperTickIndex,
	lowerTickIndex,
}: GetWhirlpoolTokenBWeightParams) => {
	const { tokenEstA, tokenEstB } = increaseLiquidityQuoteByInputTokenWithParams({
		// Dummy amount because weights depend only on current, upper boundary and lower boundary prices
		inputTokenAmount: new BN(1000000),
		inputTokenMint: tokenB.mint,
		tokenMintA: tokenA.mint,
		tokenMintB: tokenB.mint,
		tickCurrentIndex: tickCurrentIndex,
		sqrtPrice: sqrtPrice,
		tickLowerIndex: lowerTickIndex,
		tickUpperIndex: upperTickIndex,
		slippageTolerance: SLIPPAGE_TOLERANCE,
	})

	const tokenAAmount = tokenEstA.toNumber() / 10 ** tokenA.decimals
	const tokenBAmount = tokenEstB.toNumber() / 10 ** tokenB.decimals
	const currentPrice = getPriceFromSqrtPrice(sqrtPrice)
	const tokenAAsTokenB = round(tokenAAmount * currentPrice, 6)
	return tokenBAmount / (tokenBAmount + tokenAAsTokenB)
}
