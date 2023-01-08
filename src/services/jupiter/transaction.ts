import {
	AddressLookupTableAccount,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'
import fetch from 'node-fetch'
import { setTimeout } from 'node:timers/promises'

import { surfWallet, connection } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'
import { ExecuteJupiterSwapParams, JupiterSwapResponse } from './types.js'
import { fetchBestRoute } from './fetchBestRoute.js'

export const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v4/quote?slippageBps=10'
export const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v4/swap'

const _fetchEncodedTx = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol,
	onlyDirectRoutes,
}: ExecuteJupiterSwapParams): Promise<VersionedTransaction> => {
	const bestRoute = await fetchBestRoute({
		inputMint,
		outputMint,
		amountRaw,
		swapMode,
		onlyDirectRoutes,
	})

	while (true) {
		try {
			const res = (await (
				await fetch(JUPITER_SWAP_API, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						route: bestRoute,
						userPublicKey: surfWallet.publicKey.toString(),
						wrapUnwrapSOL: unwrapSol,
					}),
				})
			).json()) as JupiterSwapResponse
			return VersionedTransaction.deserialize(Buffer.from(res.swapTransaction, 'base64'))
		} catch (e) {
			console.log(e)
			await setTimeout(500)
		}
	}
}

export const fetchJupiterIx = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	onlyDirectRoutes,
	unwrapSol = true,
}: ExecuteJupiterSwapParams): Promise<{
	instruction: TransactionInstruction
	ALTAccounts: AddressLookupTableAccount[]
}> => {
	const tx = await _fetchEncodedTx({
		inputMint,
		outputMint,
		amountRaw,
		swapMode,
		unwrapSol,
		onlyDirectRoutes,
	})

	const getSwapIx = (msg: TransactionMessage) => {
		const ixs = msg.instructions
		return ixs[ixs.length - 1]
	}

	if (!tx.message.addressTableLookups.length) {
		return {
			instruction: getSwapIx(TransactionMessage.decompile(tx.message)),
			ALTAccounts: [],
		}
	}

	const ATLAccountsInfos = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(
			tx.message.addressTableLookups.map(({ accountKey }) => accountKey),
		),
	)
	const ALTAccounts = ATLAccountsInfos.map((ai, i) => {
		if (!ai) {
			throw Error(
				`Could not load account info for: ${tx.message.addressTableLookups[
					i
				].accountKey.toString()}`,
			)
		}
		return new AddressLookupTableAccount({
			key: tx.message.addressTableLookups[i].accountKey,
			state: AddressLookupTableAccount.deserialize(ai.data),
		})
	})
	const message = TransactionMessage.decompile(tx.message, {
		addressLookupTableAccounts: ALTAccounts,
	})
	return {
		instruction: getSwapIx(message),
		ALTAccounts,
	}
}
