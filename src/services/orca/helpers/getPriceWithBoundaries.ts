import { PriceMath } from '@orca-so/whirlpools-sdk'
import BN from 'bn.js'

import { lowerBoundaryBps, tokenA, tokenB, upperBoundaryBps } from '../../../global.js'

export const getPriceWithBoundaries = (sqrtPrice: BN) => {
	const price = PriceMath.sqrtPriceX64ToPrice(
		sqrtPrice,
		tokenA.decimals,
		tokenB.decimals,
	).toNumber()
  console.log(PriceMath.sqrtPriceX64ToPrice(
		sqrtPrice,
		tokenA.decimals,
		tokenB.decimals,
	))
	const upperBoundaryPrice = price * (1 + upperBoundaryBps)
	const lowerBoundaryPrice = price * (1 - lowerBoundaryBps)
	return {
		price,
		upperBoundaryPrice,
		lowerBoundaryPrice,
	}
}
