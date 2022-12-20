import {
	AddressLookupTableAccount,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'
import { BuiltTransactionData } from 'solana-tx-utils'
import fetch from 'node-fetch'

import { wallet, connection } from '../global.js'
import { retryOnThrow } from '../utils/retryOnThrow.js'
import { ExecuteJupiterSwapParams, JupiterQuoteResponse, JupiterSwapResponse } from './types.js'

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v4/quote?slippageBps=10'
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v4/swap'

const _fetchEncodedTx = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol,
}: ExecuteJupiterSwapParams): Promise<VersionedTransaction> => {
	console.log({ unwrapSol})
	const urlParams = new URLSearchParams({
		inputMint: inputMint.toString(),
		outputMint: outputMint.toString(),
		amount: amountRaw.toString(),
		swapMode,
	})
	try {
		const { data: routesInfos } = (await (
			await fetch(`${JUPITER_QUOTE_API}&${urlParams.toString()}`)
		).json()) as JupiterQuoteResponse
		const res = (await (
			await fetch(JUPITER_SWAP_API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					route: routesInfos[0],
					userPublicKey: wallet.publicKey.toString(),
					wrapUnwrapSOL: unwrapSol,
				}),
			})
		).json()) as JupiterSwapResponse
		return VersionedTransaction.deserialize(Buffer.from(res.swapTransaction, 'base64'))
	} catch (error) {
		return _fetchEncodedTx({ inputMint, outputMint, amountRaw, swapMode })
	}
}

export const fetchJupiterInstructions = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol = true,
}: ExecuteJupiterSwapParams): Promise<{
	instructions: TransactionInstruction[]
	ATLAccounts: AddressLookupTableAccount[]
}> => {
	const tx = await _fetchEncodedTx({ inputMint, outputMint, amountRaw, swapMode, unwrapSol })

	if (!tx.message.addressTableLookups.length) {
		return {
			instructions: TransactionMessage.decompile(tx.message).instructions,
			ATLAccounts: [],
		}
	}

	const ATLAccountsInfos = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(
			tx.message.addressTableLookups.map(({ accountKey }) => accountKey),
		),
	)
	const ATLAccounts = ATLAccountsInfos.map((ai, i) => {
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
		addressLookupTableAccounts: ATLAccounts,
	})
	return {
		instructions: message.instructions,
		ATLAccounts,
	}
}

export const fetchAndSignJupiterTransaction = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
	unwrapSol = true,
}: ExecuteJupiterSwapParams): Promise<BuiltTransactionData> => {
	const tx = await _fetchEncodedTx({ inputMint, outputMint, amountRaw, swapMode, unwrapSol })
	const { blockhash, lastValidBlockHeight } = await retryOnThrow(() =>
		connection.getLatestBlockhash(),
	)
	tx.message.recentBlockhash = blockhash
	tx.sign([wallet])
	return {
		transaction: tx,
		lastValidBlockHeight,
	}
}
