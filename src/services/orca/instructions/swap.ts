import {
	ParsableWhirlpool,
	SwapInput,
	WhirlpoolData,
	PDAUtil,
	ORCA_WHIRLPOOL_PROGRAM_ID,
	SwapUtils,
	swapQuoteWithParams,
	ParsableTickArray,
	TickArray,
	WhirlpoolIx,
} from '@orca-so/whirlpools-sdk'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { BN } from 'bn.js'
import { setTimeout } from 'node:timers/promises'

import { SLIPPAGE_TOLERANCE } from '../../../constants.js'
import { connection, tokenA, tokenB, surfWallet } from '../../../global.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import { whirlpoolProgram } from '../config.js'

const whirlpoolsAddresses = [
	// tickSpacing: 1
	// disabled because current liquidity is very low
	// new PublicKey('83v8iPyZihDEjDdY8RdZddyZNyUtXngz69Lgo9Kt5d6d'),
	// tickSpacing: 8
	new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm'),
	// tickSpacing: 64
	new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'),
	// tickSpacing: 128
	new PublicKey('DFVTutNYXD8z4T5cRdgpso1G3sZqQvMHWpW2N99E4DvE'),
]

type ParsedWhirlpool = WhirlpoolData & {
	oracle: PublicKey
}

const fetchWhirlpoolsData = async () => {
	const whirlpoolsAccountsInfo = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(whirlpoolsAddresses),
	)
	const whirlpoolsData = new Map<string, ParsedWhirlpool>()

	whirlpoolsAccountsInfo.forEach((ai, i) => {
		const parsed = ParsableWhirlpool.parse(ai?.data)
		if (!parsed) {
			return
		}
		whirlpoolsData.set(whirlpoolsAddresses[i].toString(), {
			...parsed,
			oracle: PDAUtil.getOracle(ORCA_WHIRLPOOL_PROGRAM_ID, whirlpoolsAddresses[i]).publicKey,
		})
	})

	return whirlpoolsData
}

const fetchTickArrays = async (whirlpoolsData: Map<string, ParsedWhirlpool>, aToB: boolean) => {
	const tickArraysAddresses: PublicKey[] = []
	whirlpoolsAddresses.forEach((pk) => {
		const addr = pk.toString()
		const data = whirlpoolsData.get(addr)
		if (!data) {
			return
		}
		const addresses = SwapUtils.getTickArrayPublicKeys(
			data.tickCurrentIndex,
			data.tickSpacing,
			aToB,
			ORCA_WHIRLPOOL_PROGRAM_ID,
			pk,
		)
		tickArraysAddresses.push(...addresses)
	})
	const tickArraysAccountsInfo = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(tickArraysAddresses),
	)
	const whirlpoolsTickArraysDataMap = new Map<string, TickArray[]>()
	tickArraysAccountsInfo.forEach((ai, i) => {
		const parsed = ParsableTickArray.parse(ai?.data)
		if (!parsed) {
			return
		}
		const whirlpoolAddr = parsed.whirlpool.toString()
		let tickArraysData = whirlpoolsTickArraysDataMap.get(whirlpoolAddr)
		if (tickArraysData) {
			tickArraysData.push({ address: tickArraysAddresses[i], data: parsed })
		} else {
			tickArraysData = [{ address: tickArraysAddresses[i], data: parsed }]
		}
		whirlpoolsTickArraysDataMap.set(whirlpoolAddr, tickArraysData)
	})

	return whirlpoolsTickArraysDataMap
}

type BestSwapParams = SwapInput &
	Pick<ParsedWhirlpool, 'tokenVaultA' | 'tokenVaultB' | 'oracle'> & {
		specifiedAmount: number
		otherAmount: number
		whirlpool: PublicKey
	}

type BuildSwapIxParams = {
	amount: number
	mode: 'ExactIn' | 'ExactOut'
	aToB?: boolean
}

/**
 * Builds USDC to SOL swap instructions with the best possible quote from SOL/USDC whirlpools
 */
export const buildSwapIx = async ({
	amount,
	mode,
	aToB = false,
}: BuildSwapIxParams): Promise<TransactionInstruction> => {
	console.log('Building orca swap ix')
	const amountSpecifiedIsInput = mode === 'ExactIn'

	const whirlpoolsData = await fetchWhirlpoolsData()
	const whirlpoolsTickArraysDataMap = await fetchTickArrays(whirlpoolsData, aToB)

	let bestSwapParams: null | BestSwapParams = null
	whirlpoolsAddresses.forEach((pk) => {
		const addr = pk.toString()
		const whirlpoolData = whirlpoolsData.get(addr)
		const tickArrays = whirlpoolsTickArraysDataMap.get(addr)
		if (!whirlpoolData || !tickArrays || tickArrays.length < 3) {
			return
		}
		const specifiedAmount = new BN(amount)
		const sqrtPriceLimit = SwapUtils.getDefaultSqrtPriceLimit(aToB)
		const otherAmountThreshold = SwapUtils.getDefaultOtherAmountThreshold(amountSpecifiedIsInput)
		try {
			const quote = swapQuoteWithParams(
				{
					tokenAmount: specifiedAmount,
					otherAmountThreshold,
					sqrtPriceLimit,
					tickArrays,
					whirlpoolData,
					amountSpecifiedIsInput,
					aToB,
				},
				SLIPPAGE_TOLERANCE,
			)
			const otherAmount =
				mode === 'ExactOut'
					? quote.estimatedAmountIn.toNumber()
					: quote.estimatedAmountOut.toNumber()
			if (
				!bestSwapParams ||
				(mode === 'ExactIn' && bestSwapParams.otherAmount < otherAmount) ||
				(mode === 'ExactOut' && bestSwapParams.otherAmount > otherAmount)
			) {
				bestSwapParams = {
					aToB,
					amountSpecifiedIsInput,
					sqrtPriceLimit,
					otherAmountThreshold,
					otherAmount,
					specifiedAmount: amount,
					amount: specifiedAmount,
					whirlpool: pk,
					tokenVaultA: whirlpoolData.tokenVaultA,
					tokenVaultB: whirlpoolData.tokenVaultB,
					oracle: whirlpoolData.oracle,
					tickArray0: tickArrays[0].address,
					tickArray1: tickArrays[1].address,
					tickArray2: tickArrays[2].address,
				}
			}
		} catch (e) {
			console.error(e)
		}
	})

	if (!bestSwapParams) {
		await setTimeout(500)
		return buildSwapIx({ amount: amount, mode, aToB })
	}

	const { instructions } = WhirlpoolIx.swapIx(whirlpoolProgram, {
		...(bestSwapParams as BestSwapParams),
		tokenOwnerAccountA: tokenA.ATAddress,
		tokenOwnerAccountB: tokenB.ATAddress,
		tokenAuthority: surfWallet.publicKey,
	})

	return instructions[0]
}
