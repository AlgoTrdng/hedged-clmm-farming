import { WhirlpoolData, WhirlpoolIx } from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { TransactionInstruction } from '@solana/web3.js'

import { WHIRLPOOL_ADDRESS } from '../../../config/index.js'
import { surfWallet, ctx } from '../../../global.js'
import { WhirlpoolPosition } from '../../../state.js'

type BuildCollectRewardsParams = {
	whirlpoolPosition: Pick<WhirlpoolPosition, 'ATAddress' | 'PDAddress'>
	whirlpoolData: WhirlpoolData
}

export const buildCollectRewardsIxs = ({
	whirlpoolPosition,
	whirlpoolData,
}: BuildCollectRewardsParams) => {
	const collectRewardsIxs: TransactionInstruction[] = []

	whirlpoolData.rewardInfos.forEach(({ vault, mint }, i) => {
		const ATAddress = getAssociatedTokenAddressSync(mint, surfWallet.publicKey)
		const { instructions: collectRewardIxs } = WhirlpoolIx.collectRewardIx(ctx.program, {
			whirlpool: WHIRLPOOL_ADDRESS,
			positionAuthority: surfWallet.publicKey,
			position: whirlpoolPosition.PDAddress,
			positionTokenAccount: whirlpoolPosition.ATAddress,
			rewardOwnerAccount: ATAddress,
			rewardVault: vault,
			rewardIndex: i,
		})
		collectRewardsIxs.push(...collectRewardIxs)
	})

	return collectRewardsIxs
}
