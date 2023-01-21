import { WhirlpoolData } from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync, createTransferInstruction } from '@solana/spl-token'
import { SystemProgram } from '@solana/web3.js'
import { buildAndSignTxFromInstructions } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { USDC_MINT } from '../constants.js'
import { tokenB, surfWallet, userWallet, connection } from '../global.js'
import { buildCloseAccountsIxs } from '../instructions/closeAccounts.js'
import { sendTransactionWrapper } from '../utils/sendTransactionWrapper.js'

const userTokenBATAccount = getAssociatedTokenAddressSync(USDC_MINT, userWallet.publicKey)

type Balances = {
	tokenA: number
	tokenB: number
}

type TransferTokensAndCloseAccountsParams = {
	balances: Balances
	shouldDelete: boolean
	whirlpoolData: WhirlpoolData
}

export const transferTokensAndCloseAccounts = async ({
	balances,
	shouldDelete,
	whirlpoolData,
}: TransferTokensAndCloseAccountsParams): Promise<void> => {
	console.log('Transferring tokens and closing accounts')
	const instructions = [
		createTransferInstruction(
			tokenB.ATAddress,
			userTokenBATAccount,
			surfWallet.publicKey,
			balances.tokenB,
		),
	]

	let solBalance = balances.tokenA - 5000
	if (shouldDelete) {
		const { instructions: closeAccountsIxs, lamportsInAccounts } = await buildCloseAccountsIxs(
			whirlpoolData.rewardInfos,
		)
		solBalance += lamportsInAccounts
		instructions.push(...closeAccountsIxs)
	}

	instructions.push(
		SystemProgram.transfer({
			fromPubkey: surfWallet.publicKey,
			lamports: solBalance,
			toPubkey: userWallet.publicKey,
		}),
	)

	const txData = await buildAndSignTxFromInstructions(
		{
			signers: [surfWallet],
			instructions,
		},
		connection,
	)
	while (true) {
		const res = await sendTransactionWrapper(txData)
		if (res.status === 'SUCCESS') {
			return
		}
		if (res.status === 'BLOCK_HEIGHT_EXCEEDED' || res.status === 'ERROR') {
			return transferTokensAndCloseAccounts({
				balances: {
					tokenA: balances.tokenA,
					tokenB: solBalance,
				},
				shouldDelete,
				whirlpoolData,
			})
		}
		await setTimeout(500)
	}
}
