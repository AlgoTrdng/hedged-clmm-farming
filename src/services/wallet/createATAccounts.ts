import { WhirlpoolRewardInfoData } from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

import { connection, surfWallet, tokenA, tokenB, userWallet } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'

export const buildCreateATAccountsIxs = async (whirlpoolRewards: WhirlpoolRewardInfoData[]) => {
	const ixs: TransactionInstruction[] = []

	// Initialize all ATAs
	const accountsMintsToInitialize = [tokenA.mint, tokenB.mint]
	const accountsAddressesToInitialize = [tokenA.ATAddress, tokenB.ATAddress]

	whirlpoolRewards.forEach(({ mint }) => {
		if (
			mint.equals(PublicKey.default) ||
			accountsMintsToInitialize.findIndex((_mint) => _mint.equals(mint)) > 0
		) {
			return
		}
		const ATAddress = getAssociatedTokenAddressSync(mint, surfWallet.publicKey)
		accountsMintsToInitialize.push(mint)
		accountsAddressesToInitialize.push(ATAddress)
	})

	const ATAccountsInfo = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(accountsAddressesToInitialize),
	)
	ATAccountsInfo.forEach((ai, i) => {
		if (!ai?.data) {
			ixs.push(
				createAssociatedTokenAccountInstruction(
					userWallet.publicKey,
					accountsAddressesToInitialize[i],
					surfWallet.publicKey,
					accountsMintsToInitialize[i],
				),
			)
		}
	})

  return ixs
}
