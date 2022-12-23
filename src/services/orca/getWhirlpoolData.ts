import { ParsableWhirlpool, WhirlpoolData } from '@orca-so/whirlpools-sdk'

import { WHIRLPOOL_ADDRESS } from '../../config.js'
import { connection } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'

export const getWhirlpoolData = async (): Promise<WhirlpoolData> => {
	const whirlpoolAccount = await retryOnThrow(() => connection.getAccountInfo(WHIRLPOOL_ADDRESS))
	const whirlpoolAccountData = ParsableWhirlpool.parse(whirlpoolAccount?.data)
	if (!whirlpoolAccountData) {
		throw Error(`Whirlpool account does not exist: ${WHIRLPOOL_ADDRESS.toString()}`)
	}
	return whirlpoolAccountData
}
