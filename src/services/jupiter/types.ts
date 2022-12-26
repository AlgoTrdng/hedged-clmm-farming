import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

type Fee = {
	amount: string
	mint: string
	pct: number
}

type MarketInfo = {
	id: string
	label: string
	inputMint: string
	outputMint: string
	notEnoughLiquidity: boolean
	inAmount: string
	outAmount: string
	priceImpactPct: number
	lpFee: Fee
	platformFee: Fee
}

export type RouteInfo = {
	inAmount: string
	outAmount: string
	priceImpactPct: number
	marketInfos: MarketInfo[]
	amount: string
	slippageBps: number
	otherAmountThreshold: string
	swapMode: string
}

export type JupiterQuoteResponse = {
	data: RouteInfo[]
	timeTaken: number
	contextSlot: number
}

export type JupiterSwapResponse = {
	swapTransaction: string
}

export type SwapMode = 'ExactIn' | 'ExactOut'

export type ExecuteJupiterSwapParams = {
	inputMint: PublicKey
	outputMint: PublicKey
	amountRaw: number | BN
	swapMode: SwapMode
	unwrapSol?: boolean
}
