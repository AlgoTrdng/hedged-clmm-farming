import { BuiltTransactionData } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { sendTransactionWrapper } from './sendTransactionWrapper.js'

export const forceSendTx = async (signedTxBuilder: () => Promise<BuiltTransactionData>) => {
	let txData = await signedTxBuilder()
	while (true) {
		const res = await sendTransactionWrapper(txData)
		switch (res.status) {
			case 'SUCCESS': {
				return res.data
			}
			case 'BLOCK_HEIGHT_EXCEEDED': {
				txData = await signedTxBuilder()
			}
		}
		await setTimeout(500)
	}
}
