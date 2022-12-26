import { PriceMath } from '@orca-so/whirlpools-sdk'
import BN from 'bn.js'

import { lowerBoundaryBps, tokenA, tokenB, upperBoundaryBps } from '../../../global.js'

export const getPriceFromSqrtPrice = (sqrtPrice: BN) =>
	PriceMath.sqrtPriceX64ToPrice(sqrtPrice, tokenA.decimals, tokenB.decimals).toNumber()

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
