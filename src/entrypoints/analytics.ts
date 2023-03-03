import { setTimeout } from 'node:timers/promises'
import {
	collectFeesQuote,
	decreaseLiquidityQuoteByLiquidityWithParams,
	ParsablePosition,
	ParsableTickArray,
	PriceMath,
	TickArrayUtil,
	WhirlpoolData,
} from '@orca-so/whirlpools-sdk'
import { AccountInfo } from '@solana/web3.js'
import { AccountLayout, RawAccount } from '@solana/spl-token'
import { Structure } from '@solana/buffer-layout'

import { connection, driftUser, tokenA, tokenB } from '../global.js'
import { getDriftTokenAmounts } from '../services/drift/getTokenAmount.js'
import { fetchWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { loadState, state } from '../state.js'
import { retryOnThrow } from '../utils/retryOnThrow.js'
import { getTickArrays } from '../services/orca/helpers/getTickArrays.js'
import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { updateAnalytics } from '../services/analyticsDb/index.js'
import { TokenInfo } from '../types.js'

const toUiAmount = (amount: number, token: TokenInfo) => amount / 10 ** token.decimals

const floor = (amount: number, token: TokenInfo) =>
	Math.floor(amount * 10 ** token.decimals) / 10 ** token.decimals

type TickArrayAddresses = {
	whirlpoolData: WhirlpoolData
	positionAccountInfo: AccountInfo<Buffer>
	tickLowerIndex: number
	tickUpperIndex: number
	tickArraysAccountsInfos: AccountInfo<Buffer>[]
}

const parseWhirlpoolPositionAccounts = ({
	whirlpoolData,
	positionAccountInfo,
	tickLowerIndex,
	tickUpperIndex,
	tickArraysAccountsInfos,
}: TickArrayAddresses) => {
	const parsedTickArraysAccounts = tickArraysAccountsInfos.map((ai) =>
		ParsableTickArray.parse(ai?.data),
	)

	const [tickArrayLower, tickArrayUpper] = [
		parsedTickArraysAccounts[0]!,
		parsedTickArraysAccounts.length > 1
			? parsedTickArraysAccounts[1]!
			: parsedTickArraysAccounts[0]!,
	]

	const tickLower = TickArrayUtil.getTickFromArray(
		tickArrayLower,
		tickLowerIndex,
		whirlpoolData.tickSpacing,
	)
	const tickUpper = TickArrayUtil.getTickFromArray(
		tickArrayUpper,
		tickUpperIndex,
		whirlpoolData.tickSpacing,
	)

	return {
		positionData: ParsablePosition.parse(positionAccountInfo.data)!,
		tickLower,
		tickUpper,
	}
}

let init = true

while (true) {
	if (!init) {
		// wait 30 minutes
		await setTimeout(1_800_000)
	} else {
		init = false
	}

	await loadState()
	if (Object.keys(state).length < 4) {
		console.error('🚨 Can not take a snapshot of balances. Position is not opened.')
		continue
	}

	console.log('🔔 Taking snapshot of balances')
	const whirlpoolData = await fetchWhirlpoolData()

	const { tickLowerIndex, tickUpperIndex } = state.whirlpoolPosition
	const { tickLowerArrayAddress, tickUpperArrayAddress } = getTickArrays({
		tickSpacing: whirlpoolData.tickSpacing,
		tickLowerIndex,
		tickUpperIndex,
	})

	const accountsToFetch = [
		driftUser,
		tokenA.ATAddress,
		tokenB.ATAddress,
		state.whirlpoolPosition.PDAddress,
		tickLowerArrayAddress,
	]
	if (!tickLowerArrayAddress.equals(tickUpperArrayAddress)) {
		accountsToFetch.push(tickUpperArrayAddress)
	}
	const accountsInfos = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(accountsToFetch),
	)
	if (accountsInfos.some((ai) => !ai?.data)) {
		continue
	}
	const [driftUserAccount, tokenAai, tokenBai, positionAccountInfo, ...tickArraysAccountsInfos] =
		accountsInfos as AccountInfo<Buffer>[]

	const { positionData, tickLower, tickUpper } = parseWhirlpoolPositionAccounts({
		whirlpoolData,
		positionAccountInfo,
		tickArraysAccountsInfos,
		tickLowerIndex,
		tickUpperIndex,
	})

	const collectQuoteParams = {
		whirlpool: whirlpoolData,
		position: positionData,
		tickLower,
		tickUpper,
	}
	const feesQuote = collectFeesQuote(collectQuoteParams)
	// const rewardQuote = collectRewardsQuote(collectQuoteParams)

	const { tokenEstA, tokenEstB } = decreaseLiquidityQuoteByLiquidityWithParams({
		liquidity: state.whirlpoolPosition.liquidity,
		slippageTolerance: SLIPPAGE_TOLERANCE,
		sqrtPrice: whirlpoolData.sqrtPrice,
		tickCurrentIndex: whirlpoolData.tickCurrentIndex,
		tickLowerIndex: state.whirlpoolPosition.tickLowerIndex,
		tickUpperIndex: state.whirlpoolPosition.tickUpperIndex,
	})

	const accountLayout = AccountLayout as Structure<RawAccount>
	const [tokenAWalletBalance, tokenBWalletBalance] = [tokenAai, tokenBai].map((ai) =>
		Number(accountLayout.decode(ai.data).amount),
	)

	const { tokenA: borrowedTokenA, tokenB: suppliedTokenB } = await getDriftTokenAmounts(
		driftUserAccount,
	)

	const aggregatedTokenA = toUiAmount(
		tokenAWalletBalance + tokenEstA.toNumber() + feesQuote.feeOwedA.toNumber() - borrowedTokenA,
		tokenA,
	)
	const aggregatedTokenB = toUiAmount(
		tokenBWalletBalance + tokenEstB.toNumber() + feesQuote.feeOwedB.toNumber() + suppliedTokenB,
		tokenB,
	)

	const whirlpoolPrice = floor(
		PriceMath.sqrtPriceX64ToPrice(
			whirlpoolData.sqrtPrice,
			tokenA.decimals,
			tokenB.decimals,
		).toNumber(),
		tokenB,
	)
	const aggregatedTokenAInUsdc = aggregatedTokenA * whirlpoolPrice
	const totalInUsdc = floor(aggregatedTokenAInUsdc + aggregatedTokenB, tokenB)

	await updateAnalytics({
		whirlpoolPrice,
		balances: {
			tokenA: {
				wallet: toUiAmount(tokenAWalletBalance, tokenA),
				drift: -toUiAmount(borrowedTokenA, tokenA),
				whirlpool: toUiAmount(tokenEstA.toNumber(), tokenA),
				rewardsAndFees: toUiAmount(feesQuote.feeOwedA.toNumber(), tokenA),
			},
			tokenB: {
				wallet: toUiAmount(tokenBWalletBalance, tokenB),
				drift: toUiAmount(suppliedTokenB, tokenB),
				whirlpool: toUiAmount(tokenEstB.toNumber(), tokenB),
				rewardsAndFees: toUiAmount(feesQuote.feeOwedB.toNumber(), tokenB),
			},
		},
		aggregatedBalances: {
			tokenA: aggregatedTokenA,
			tokenB: aggregatedTokenB,
		},
		totalInUsdc: totalInUsdc,
		timestamp: new Date().getTime(),
	})
	console.log('✅ Snapshot successfully taken')
}
