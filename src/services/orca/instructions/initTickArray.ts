import {
	TickUtil,
	PDAUtil,
	ORCA_WHIRLPOOL_PROGRAM_ID,
	WhirlpoolIx,
	WhirlpoolData,
} from '@orca-so/whirlpools-sdk'

import { WHIRLPOOL_ADDRESS } from '../../../config/index.js'
import { surfWallet } from '../../../global.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import { fetcher, whirlpoolProgram } from '../config.js'

export const buildInitTickArrayIx = async (whirlpoolData: WhirlpoolData) => {
	const startTick = TickUtil.getStartTickIndex(
		whirlpoolData.tickCurrentIndex,
		whirlpoolData.tickSpacing,
	)
	const tickArrayPda = PDAUtil.getTickArray(ORCA_WHIRLPOOL_PROGRAM_ID, WHIRLPOOL_ADDRESS, startTick)
	const tickArrayAccount = await retryOnThrow(() =>
		fetcher.getTickArray(tickArrayPda.publicKey, true),
	)

	if (!tickArrayAccount) {
		const ix = WhirlpoolIx.initTickArrayIx(whirlpoolProgram, {
			startTick,
			tickArrayPda,
			whirlpool: WHIRLPOOL_ADDRESS,
			funder: surfWallet.publicKey,
		})
		return ix.instructions
	}

	return []
}
