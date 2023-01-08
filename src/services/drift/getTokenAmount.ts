import { UserAccount, getTokenAmount } from '@drift-labs/sdk'
import { AccountInfo } from '@solana/web3.js'

import { connection, driftUser } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'
import { driftProgram, tokenASpotMarket, tokenBSpotMarket } from './config.js'

export const getDriftTokenAmounts = async (driftUserAccount?: AccountInfo<Buffer>) => {
	const _driftUserAccount =
		driftUserAccount ||
		(await retryOnThrow(() => connection.getAccountInfo(driftUser, 'confirmed')))
	if (!_driftUserAccount?.data) {
		throw Error('Drift user account does not exist')
	}
	const parsed = driftProgram.coder.accounts.decode<UserAccount>('User', _driftUserAccount.data)

	const [tokenBSpotPosition, tokenASpotPosition] = parsed.spotPositions
	return {
		tokenA: getTokenAmount(
			tokenASpotPosition.scaledBalance,
			tokenASpotMarket,
			tokenASpotPosition.balanceType,
		).toNumber(),
		tokenB: getTokenAmount(
			tokenBSpotPosition.scaledBalance,
			tokenBSpotMarket,
			tokenBSpotPosition.balanceType,
		).toNumber(),
	}
}
