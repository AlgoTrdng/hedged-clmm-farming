import { PositionData, PriceMath } from '@orca-so/whirlpools-sdk'
import BN from 'bn.js'

import { lowerBoundaryBps, tokenA, tokenB, upperBoundaryBps } from '../../../global.js'

export const getPriceFromSqrtPrice = (sqrtPrice: BN) =>
	Number(
		PriceMath.sqrtPriceX64ToPrice(sqrtPrice, tokenA.decimals, tokenB.decimals)
			.toNumber()
			.toFixed(tokenB.decimals),
	)

export const getBoundariesPricesFromPrice = (price: number) => {
	const upperBoundaryPrice = price * (1 + upperBoundaryBps)
	const lowerBoundaryPrice = price * (1 - lowerBoundaryBps)
	return { upperBoundaryPrice, lowerBoundaryPrice }
}

export const getPriceWithBoundariesFromSqrtPrice = (sqrtPrice: BN) => {
	const price = getPriceFromSqrtPrice(sqrtPrice)
	return {
		...getBoundariesPricesFromPrice(price),
		price,
	}
}

export const getBoundariesFromTickIndexes = ({
	tickLowerIndex,
	tickUpperIndex,
}: Pick<PositionData, 'tickLowerIndex' | 'tickUpperIndex'>) => {
	const upperBoundaryPrice = PriceMath.tickIndexToPrice(
		tickUpperIndex,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()
	const lowerBoundaryPrice = PriceMath.tickIndexToPrice(
		tickLowerIndex,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()
	return { upperBoundaryPrice, lowerBoundaryPrice }
}

type GetAllowedPriceMoveFromBoundariesParams = {
	upperBoundaryPrice: number
	lowerBoundaryPrice: number
}

export const getAllowedPriceMoveFromBoundaries = ({
	upperBoundaryPrice,
	lowerBoundaryPrice,
}: GetAllowedPriceMoveFromBoundariesParams) => {
	const priceRange = upperBoundaryPrice - lowerBoundaryPrice
	// 5% pice move in price range
	const allowedMove = priceRange / 20
	return Number(allowedMove.toFixed(6))
}
