import { ALT_ADDRESS } from '../config.js'
import { connection } from '../global.js'
import { retryOnThrow } from './retryOnThrow.js'

export const loadALTAccount = async () => {
	const altAccountInfo = await retryOnThrow(() => connection.getAddressLookupTable(ALT_ADDRESS))
	if (!altAccountInfo.value) {
		throw Error(`ALT: ${ALT_ADDRESS.toString()} does not exist`)
	}
	return altAccountInfo.value
}
