import {
	collectRewardsQuote,
	ParsableTickArray,
	TickArrayData,
	TickArrayUtil,
	WhirlpoolData,
	WhirlpoolIx,
} from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

import { wallet, ctx, connection, fetcher } from '../../../global.js'
import { buildCreateAndCloseATAccountsInstructions, TokenData } from '../../../utils/ATAccounts.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import { PositionMetadata } from '../types.js'

type GetTickDataParams = {
	upperAddress: PublicKey
	lowerAddress: PublicKey
	tickLowerIndex: number
	tickUpperIndex: number
	tickSpacing: number
}

const getTickData = async ({
	upperAddress,
	lowerAddress,
	tickLowerIndex,
	tickUpperIndex,
	tickSpacing,
}: GetTickDataParams) => {
	// [upper, lower]
	let tickArrays: TickArrayData[] = []
	if (upperAddress.equals(lowerAddress)) {
		const tickArrayData = await retryOnThrow(() => fetcher.getTickArray(upperAddress, true))
		if (!tickArrayData) {
			throw Error('Tick array does not exist')
		}
		tickArrays = [tickArrayData, tickArrayData]
	} else {
		const tickArraysAccounts = await retryOnThrow(() =>
			connection.getMultipleAccountsInfo([upperAddress, lowerAddress]),
		)
		tickArraysAccounts.forEach((ai, i) => {
			const parsed = ParsableTickArray.parse(ai?.data)
			if (!parsed) {
				throw Error('Tick array does not exist')
			}
			tickArrays[i] = parsed
		})
	}

	return {
		tickUpper: TickArrayUtil.getTickFromArray(tickArrays[0], tickUpperIndex, tickSpacing),
		tickLower: TickArrayUtil.getTickFromArray(tickArrays[1], tickLowerIndex, tickSpacing),
	}
}

type BuildCollectRewardsParams = {
	positionMetadata: PositionMetadata
	whirlpoolData: WhirlpoolData
	tickUpperArrayAddress: PublicKey
	tickLowerArrayAddress: PublicKey
}

export const buildCollectRewardsIxs = async ({
	positionMetadata,
	whirlpoolData,
	tickLowerArrayAddress,
	tickUpperArrayAddress,
}: BuildCollectRewardsParams) => {
	const tickData = await getTickData({
		upperAddress: tickUpperArrayAddress,
		lowerAddress: tickLowerArrayAddress,
		tickUpperIndex: positionMetadata.tickUpperIndex,
		tickLowerIndex: positionMetadata.tickLowerIndex,
		tickSpacing: whirlpoolData.tickSpacing,
	})
	const rewardsData = collectRewardsQuote({
		whirlpool: whirlpoolData,
		position: positionMetadata,
		...tickData,
	})
	const tokensData: TokenData[] = []
	const collectRewardsIxs: TransactionInstruction[] = []

	whirlpoolData.rewardInfos.forEach(({ vault, mint }, i) => {
		const rewardAmount = rewardsData[i]?.toNumber() || 0
		if (!rewardAmount) {
			return
		}

		const ATAddress = getAssociatedTokenAddressSync(mint, wallet.publicKey)
		tokensData.push({ mint, ATAddress })

		const { instructions: collectRewardIxs } = WhirlpoolIx.collectRewardIx(ctx.program, {
			whirlpool: positionMetadata.whirlpool,
			positionAuthority: wallet.publicKey,
			position: positionMetadata.PDAddress,
			positionTokenAccount: positionMetadata.ATAddress,
			rewardOwnerAccount: tokensData[i].ATAddress,
			rewardVault: vault,
			rewardIndex: i,
		})
		collectRewardsIxs.push(...collectRewardIxs)
	})

	const setupATAsInstructions: TransactionInstruction[] = []
	if (tokensData.length) {
		const { setupInstructions } = await buildCreateAndCloseATAccountsInstructions(tokensData)
		setupATAsInstructions.push(...setupInstructions)
	}

	return {
		setupATAsInstructions,
		collectRewardsIxs,
	}
}
