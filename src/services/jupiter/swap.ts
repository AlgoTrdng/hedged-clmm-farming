import { setTimeout } from 'node:timers/promises'
import { sendTransaction } from 'solana-tx-utils'

import { connection } from '../../global.js'
import { fetchAndSignJupiterTransaction } from './transaction.js'
import { ExecuteJupiterSwapParams } from './types.js'

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

		if (res.status === 'BLOCK_HEIGHT_EXCEEDED' || res.error?.error === 6000 || res.error?.error === 6001) {
			tx = await _fetchTxs()
			continue
		}

		await setTimeout(500)
	}
}
