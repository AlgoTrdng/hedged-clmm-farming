import { ParsableWhirlpool, WhirlpoolData } from '@orca-so/whirlpools-sdk'
import { AccountInfo } from '@solana/web3.js'

import { WHIRLPOOL_ADDRESS } from '../../config/index.js'
import { connection } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'

export const fetchWhirlpoolData = async (): Promise<WhirlpoolData> => {
	const whirlpoolAccount = await retryOnThrow(() => connection.getAccountInfo(WHIRLPOOL_ADDRESS))
	const whirlpoolAccountData = ParsableWhirlpool.parse(whirlpoolAccount?.data)
	if (!whirlpoolAccountData) {
		throw Error(`Whirlpool account does not exist: ${WHIRLPOOL_ADDRESS.toString()}`)
	}
	return whirlpoolAccountData
}

export const initWhirlpoolState = async (updateMethod: 'polling' | 'websocket') => {
	const whirlpoolData = {
		value: await fetchWhirlpoolData(),
	}

	const update = async () => {
		if (updateMethod === 'websocket') {
			return
		}
		whirlpoolData.value = await fetchWhirlpoolData()
	}

	if (updateMethod === 'websocket') {
		const handleAccountChange = (ai: AccountInfo<Buffer>) => {
			const data = ParsableWhirlpool.parse(ai.data)
			if (!data) {
				return
			}
			whirlpoolData.value = data
		}

		const refreshTimeout = 1000 * 60 * 15
		let subId = connection.onAccountChange(WHIRLPOOL_ADDRESS, handleAccountChange)
		setInterval(() => {
			console.log('Refreshing connection')
			connection.removeAccountChangeListener(subId)
			subId = connection.onAccountChange(WHIRLPOOL_ADDRESS, handleAccountChange)
		}, refreshTimeout)
	}

	return {
		whirlpoolData,
		update,
	}
}
