import { getAssociatedTokenAddressSync, createTransferInstruction } from '@solana/spl-token'
import { SystemProgram, TransactionInstruction } from '@solana/web3.js'

import { surfWallet, tokenB, usdcPositionSizeRaw, userWallet } from '../../global.js'

const userTokenBATAccount = getAssociatedTokenAddressSync(tokenB.mint, userWallet.publicKey)

export const buildDepositToSurfWalletIxs = () => {
	const ixs: TransactionInstruction[] = []

	ixs.push(
		SystemProgram.transfer({
			fromPubkey: userWallet.publicKey,
			lamports: 50_000_000,
			toPubkey: surfWallet.publicKey,
		}),
		createTransferInstruction(
			userTokenBATAccount,
			tokenB.ATAddress,
			userWallet.publicKey,
			usdcPositionSizeRaw,
		),
	)

	return ixs
}
