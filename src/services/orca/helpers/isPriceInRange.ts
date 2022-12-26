import { PriceMath } from '@orca-so/whirlpools-sdk'

import { tokenA, tokenB } from '../../../global.js'

export type IsPriceInRangeParams = {
	positionTickUpperIndex: number
	positionTickLowerIndex: number
	currentPoolPrice: number
}

export const isPriceInRange = ({
	positionTickLowerIndex,
	positionTickUpperIndex,
	currentPoolPrice,
}: IsPriceInRangeParams) => {
	const lowerBoundaryPrice = PriceMath.tickIndexToPrice(
		positionTickLowerIndex,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()
	const upperBoundaryPrice = PriceMath.tickIndexToPrice(
		positionTickUpperIndex,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()

	const range = upperBoundaryPrice - lowerBoundaryPrice
	const oneSideRange = range / 2

	// To keep LTV on drift sage, "safe range" is 50% of "real range"
	// max price = 50% upper range
	const maxPrice = upperBoundaryPrice - oneSideRange * 0.5
	// min price = 50% lower range
	const minPrice = lowerBoundaryPrice + oneSideRange * 0.5

	return currentPoolPrice > minPrice && currentPoolPrice < maxPrice
}
