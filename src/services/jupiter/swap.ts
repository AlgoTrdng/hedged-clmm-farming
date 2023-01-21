import { setTimeout } from 'node:timers/promises'
import { BuiltTransactionData, buildAndSignTxFromInstructions } from 'solana-tx-utils'

import { connection, surfWallet } from '../../global.js'
import { buildPriorityFeeIxs } from '../../instructions/priorityFee.js'
import { sendTransactionWrapper } from '../../utils/sendTransactionWrapper.js'
import { fetchJupiterIx } from './transaction.js'
import { ExecuteJupiterSwapParams } from './types.js'

const fetchAndSignJupiterTransaction = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol = true,
	onlyDirectRoutes,
}: ExecuteJupiterSwapParams): Promise<BuiltTransactionData> => {
	const { instruction: swapIx, ALTAccounts } = await fetchJupiterIx({
		inputMint,
		outputMint,
		amountRaw,
		swapMode,
		unwrapSol,
		onlyDirectRoutes,
	})

	const txData = await buildAndSignTxFromInstructions(
		{
			signers: [surfWallet],
			instructions: [
				...buildPriorityFeeIxs({
					units: 1200000,
				}),
				swapIx,
			],
			addressLookupTables: ALTAccounts,
		},
		connection,
	)

	return txData
}

export const executeJupiterSwap = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol = true,
	onlyDirectRoutes,
}: ExecuteJupiterSwapParams) => {
	const _fetchTxs = () =>
		fetchAndSignJupiterTransaction({
			inputMint,
			outputMint,
			amountRaw,
			swapMode,
			unwrapSol,
			onlyDirectRoutes,
		})
	let txData = await _fetchTxs()

	while (true) {
		const res = await sendTransactionWrapper(txData)

		if (res.status === 'SUCCESS') {
			return
		}

		if (
			res.status === 'BLOCK_HEIGHT_EXCEEDED' ||
			res.error?.error === 6000 ||
			res.error?.error === 6001
		) {
			txData = await _fetchTxs()
			await setTimeout(500)
			continue
		}

		await setTimeout(500)
	}
}
