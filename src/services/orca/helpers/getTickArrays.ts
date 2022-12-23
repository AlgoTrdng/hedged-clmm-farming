import { ORCA_WHIRLPOOL_PROGRAM_ID, PDAUtil } from '@orca-so/whirlpools-sdk'

import { WHIRLPOOL_ADDRESS } from '../../../config.js'

type GetTickArraysParams = {
	tickLowerIndex: number
	tickUpperIndex: number
	tickSpacing: number
}

export const getTickArrays = ({
	tickLowerIndex,
	tickUpperIndex,
	tickSpacing,
}: GetTickArraysParams) => {
	const { publicKey: tickLowerArrayAddress } = PDAUtil.getTickArrayFromTickIndex(
		tickLowerIndex,
		tickSpacing,
		WHIRLPOOL_ADDRESS,
		ORCA_WHIRLPOOL_PROGRAM_ID,
	)
	const { publicKey: tickUpperArrayAddress } = PDAUtil.getTickArrayFromTickIndex(
		tickUpperIndex,
		tickSpacing,
		WHIRLPOOL_ADDRESS,
		ORCA_WHIRLPOOL_PROGRAM_ID,
	)
	return {
		tickLowerArrayAddress,
		tickUpperArrayAddress,
	}
}
