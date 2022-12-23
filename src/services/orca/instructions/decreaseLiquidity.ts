import {
	WhirlpoolData,
	PositionData,
	CollectFeesParams,
	decreaseLiquidityQuoteByLiquidityWithParams,
	WhirlpoolIx,
} from '@orca-so/whirlpools-sdk'
import { PublicKey } from '@solana/web3.js'

import { SLIPPAGE_TOLERANCE } from '../../../constants.js'
import { ctx } from '../../../global.js'

type BuildDecreaseLiquidityIxParams = {
	whirlpoolData: WhirlpoolData
	position: PositionData
	accounts: CollectFeesParams
	tickLowerArrayAddress: PublicKey
	tickUpperArrayAddress: PublicKey
}

export const buildDecreaseLiquidityIx = async ({
	whirlpoolData,
	position,
	accounts,
	tickLowerArrayAddress,
	tickUpperArrayAddress,
}: BuildDecreaseLiquidityIxParams) => {
	const decreaseLiquidityQuote = decreaseLiquidityQuoteByLiquidityWithParams({
		liquidity: position.liquidity,
		slippageTolerance: SLIPPAGE_TOLERANCE,
		sqrtPrice: whirlpoolData.sqrtPrice,
		tickCurrentIndex: whirlpoolData.tickCurrentIndex,
		tickLowerIndex: position.tickLowerIndex,
		tickUpperIndex: position.tickUpperIndex,
	})
	const { instructions: decreaseLiquidityIx } = WhirlpoolIx.decreaseLiquidityIx(ctx.program, {
		liquidityAmount: decreaseLiquidityQuote.liquidityAmount,
		tokenMinA: decreaseLiquidityQuote.tokenMinA,
		tokenMinB: decreaseLiquidityQuote.tokenMinB,
		tickArrayLower: tickLowerArrayAddress,
		tickArrayUpper: tickUpperArrayAddress,
		...accounts,
	})
	return decreaseLiquidityIx[0]
}
