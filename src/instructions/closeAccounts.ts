import { WhirlpoolRewardInfoData } from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync, createCloseAccountInstruction } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

import { connection, driftUser, driftUserStats, surfWallet, tokenA, tokenB } from '../global.js'
import { driftProgram, DRIFT_STATE } from '../services/drift/config.js'
import { retryOnThrow } from '../utils/retryOnThrow.js'

export const buildCloseAccountsIxs = async (whirlpoolRewards: WhirlpoolRewardInfoData[]) => {
	let lamportsInAccounts = 0
	const instructions = [
		driftProgram.instruction.deleteUser({
			accounts: {
				user: driftUser,
				userStats: driftUserStats,
				state: DRIFT_STATE,
				authority: surfWallet.publicKey,
			},
		}),
	]

	const accountsMintsToClose = [tokenA.mint, tokenB.mint]
	const accountsAddressesToClose = [tokenA.ATAddress, tokenB.ATAddress]

	whirlpoolRewards.forEach(({ mint }) => {
		if (
			mint.equals(PublicKey.default) ||
			accountsMintsToClose.findIndex((_mint) => _mint.equals(mint)) > -1
		) {
			return
		}
		accountsMintsToClose.push(mint)
		accountsAddressesToClose.push(getAssociatedTokenAddressSync(mint, surfWallet.publicKey))
	})

	const accountsInfos = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo([driftUser, ...accountsAddressesToClose]),
	)
	lamportsInAccounts += accountsInfos[0]?.lamports || 0
	accountsInfos.slice(1).forEach((ai, i) => {
		if (ai?.data) {
			lamportsInAccounts += ai.lamports
			instructions.push(
				createCloseAccountInstruction(
					accountsAddressesToClose[i],
					surfWallet.publicKey,
					surfWallet.publicKey,
				),
			)
		}
	})

	return {
		instructions,
		lamportsInAccounts,
	}
}
