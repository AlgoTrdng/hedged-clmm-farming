import { SYSVAR_RENT_PUBKEY, SystemProgram, TransactionInstruction } from '@solana/web3.js'

import { connection, driftUser, driftUserStats, surfWallet, userWallet } from '../../../global.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import { driftProgram, DRIFT_STATE } from '../config.js'

export const buildDriftInitializeUserIx = async () => {
	const ixs: TransactionInstruction[] = []
	const name = Buffer.from('surf' + ' '.repeat(28), 'utf-8')

	const [driftUserStatsAccount, driftUserAccount] = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo([driftUserStats, driftUser]),
	)

	if (!driftUserStatsAccount?.data) {
		ixs.push(
			driftProgram.instruction.initializeUserStats({
				accounts: {
					userStats: driftUserStats,
					state: DRIFT_STATE,
					authority: surfWallet.publicKey,
					payer: userWallet.publicKey,
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: SystemProgram.programId,
				},
			}),
		)
	}

	if (!driftUserAccount?.data) {
		ixs.push(
			driftProgram.instruction.initializeUser(0, Array(...name), {
				accounts: {
					user: driftUser,
					userStats: driftUserStats,
					state: DRIFT_STATE,
					authority: surfWallet.publicKey,
					payer: userWallet.publicKey,
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: SystemProgram.programId,
				},
			}),
		)
	}

	return ixs
}
