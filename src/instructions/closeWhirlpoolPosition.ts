import {
	WhirlpoolIx,
	CollectFeesParams,
	WhirlpoolData,
	DecreaseLiquidityQuote,
} from '@orca-so/whirlpools-sdk'
import { WHIRLPOOL_ADDRESS } from '../config/index.js'

import { surfWallet, tokenA, tokenB } from '../global.js'
import { whirlpoolProgram } from '../services/orca/config.js'
import { getTickArrays } from '../services/orca/helpers/getTickArrays.js'
import { buildCloseWhirlpoolPositionIx } from '../services/orca/instructions/closePosition.js'
import { WhirlpoolPosition } from '../state.js'

export type BuildCloseWhirlpoolPositionIxParams = {
	whirlpoolData: WhirlpoolData
	whirlpoolPosition: WhirlpoolPosition
	decreaseLiquidityQuote: DecreaseLiquidityQuote
}

export const buildCloseWhirlpoolPositionIxs = ({
	whirlpoolData,
	whirlpoolPosition,
	decreaseLiquidityQuote,
}: BuildCloseWhirlpoolPositionIxParams) => {
	const { tickLowerArrayAddress, tickUpperArrayAddress } = getTickArrays({
		tickLowerIndex: whirlpoolPosition.tickLowerIndex,
		tickUpperIndex: whirlpoolPosition.tickUpperIndex,
		tickSpacing: whirlpoolData.tickSpacing,
	})

	const { instructions: updateFeesAndRewardsIxs } = WhirlpoolIx.updateFeesAndRewardsIx(
		whirlpoolProgram,
		{
			whirlpool: WHIRLPOOL_ADDRESS,
			position: whirlpoolPosition.PDAddress,
			tickArrayLower: tickLowerArrayAddress,
			tickArrayUpper: tickUpperArrayAddress,
		},
	)

	const collectFeesIxAccounts: CollectFeesParams = {
		whirlpool: WHIRLPOOL_ADDRESS,
		positionAuthority: surfWallet.publicKey,
		position: whirlpoolPosition.PDAddress,
		positionTokenAccount: whirlpoolPosition.ATAddress,
		tokenOwnerAccountA: tokenA.ATAddress,
		tokenOwnerAccountB: tokenB.ATAddress,
		tokenVaultA: whirlpoolData.tokenVaultA,
		tokenVaultB: whirlpoolData.tokenVaultB,
	}

	const { instructions: collectFeesIx } = WhirlpoolIx.collectFeesIx(
		whirlpoolProgram,
		collectFeesIxAccounts,
	)

	const { instructions: decreaseLiquidityIx } = WhirlpoolIx.decreaseLiquidityIx(whirlpoolProgram, {
		liquidityAmount: decreaseLiquidityQuote.liquidityAmount,
		tokenMinA: decreaseLiquidityQuote.tokenMinA,
		tokenMinB: decreaseLiquidityQuote.tokenMinB,
		tickArrayLower: tickLowerArrayAddress,
		tickArrayUpper: tickUpperArrayAddress,
		...collectFeesIxAccounts,
	})

	const closePositionIx = buildCloseWhirlpoolPositionIx(whirlpoolPosition)

	return {
		instructions: [
			...updateFeesAndRewardsIxs,
			...collectFeesIx,
			...decreaseLiquidityIx,
			...closePositionIx,
		],
		withdrawAmounts: {
			tokenA: decreaseLiquidityQuote.tokenEstA.toNumber(),
			tokenB: decreaseLiquidityQuote.tokenEstB.toNumber(),
		},
	}
}
