import { UserAccount, getTokenAmount } from '@drift-labs/sdk'

import { connection, driftUser } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'
import { driftProgram, tokenASpotMarket } from './config.js'

export const getSpotMarketsTokenAmounts = async () => {
	const driftUserAccount = await retryOnThrow(() =>
		connection.getAccountInfo(driftUser, 'confirmed'),
	)
	if (!driftUserAccount?.data) {
		throw Error('Drift user account does not exist')
	}
	const parsed = driftProgram.coder.accounts.decode<UserAccount>('User', driftUserAccount.data)

	const [tokenBSpotPosition, tokenASpotPosition] = parsed.spotPositions
	return {
		tokenA: getTokenAmount(
			tokenASpotPosition.scaledBalance,
			tokenASpotMarket,
			tokenASpotPosition.balanceType,
		).toNumber(),
		tokenB: getTokenAmount(
			tokenBSpotPosition.scaledBalance,
			tokenASpotMarket,
			tokenBSpotPosition.balanceType,
		).toNumber(),
	}
}
