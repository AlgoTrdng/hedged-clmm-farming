import { setTimeout } from 'node:timers/promises'
import {
	sendTransaction,
	BuiltTransactionData,
	buildAndSignTxFromInstructions,
} from 'solana-tx-utils'

import { connection, surfWallet } from '../../global.js'
import { buildPriorityFeeIxs } from '../../instructions/priorityFee.js'
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
					units: 500000,
					unitPrice: 30000,
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
	let tx = await _fetchTxs()

	while (true) {
		const res = await sendTransaction(
			{
				...tx,
				connection,
			},
			{ log: true },
		)

		if (res.status === 'SUCCESS') {
			return
		}

		if (
			res.status === 'BLOCK_HEIGHT_EXCEEDED' ||
			res.error?.error === 6000 ||
			res.error?.error === 6001
		) {
			tx = await _fetchTxs()
			continue
		}

		await setTimeout(500)
	}
}
