import fetch from 'node-fetch'
import { setTimeout } from 'node:timers/promises'

import { ExecuteJupiterSwapParams, JupiterQuoteResponse, RouteInfo } from './types.js'

export const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v4/quote?slippageBps=10'

export const fetchBestRoute = async ({
	inputMint,
	outputMint,
	amountRaw,
	swapMode,
}: Omit<ExecuteJupiterSwapParams, 'unwrapSol'>): Promise<RouteInfo> => {
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
		if (routesInfos.length) {
			return routesInfos[0]
		}
	} catch {}
	await setTimeout(500)
	return fetchBestRoute({
		inputMint,
		outputMint,
		amountRaw,
		swapMode,
	})
}
