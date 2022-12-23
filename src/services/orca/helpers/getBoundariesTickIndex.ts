import { TickUtil, PriceMath } from '@orca-so/whirlpools-sdk'
import Decimal from 'decimal.js'

import { tokenA, tokenB } from '../../../global.js'

type GetBoundariesTicksParams = {
	upperBoundary: number
	lowerBoundary: number
	tickSpacing: number
}

export const getBoundariesTickIndexes = ({
	upperBoundary,
	lowerBoundary,
	tickSpacing,
}: GetBoundariesTicksParams) => {
	const tickUpperIndex = TickUtil.getInitializableTickIndex(
		PriceMath.priceToTickIndex(new Decimal(upperBoundary), tokenA.decimals, tokenB.decimals),
		tickSpacing,
	)
	const tickLowerIndex = TickUtil.getInitializableTickIndex(
		PriceMath.priceToTickIndex(new Decimal(lowerBoundary), tokenA.decimals, tokenB.decimals),
		tickSpacing,
	)
	return {
		tickUpperIndex,
		tickLowerIndex,
	}
}
