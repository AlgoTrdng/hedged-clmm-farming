import { sendAndConfirmTransaction, SendAndConfirmTransactionParams } from 'solana-tx-utils'

import { connection, updateMethod } from '../global.js'

export const sendTransactionWrapper = async ({
	transaction,
	lastValidBlockHeight,
}: Omit<SendAndConfirmTransactionParams, 'connection'>) => {
	return sendAndConfirmTransaction(
		{
			transaction,
			lastValidBlockHeight,
			connection,
		},
		{
			log: true,
			method: updateMethod,
			confirmationCommitment: 'confirmed',
		},
	)
}
