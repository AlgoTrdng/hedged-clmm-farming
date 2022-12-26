import { SYSVAR_RENT_PUBKEY, SystemProgram, TransactionInstruction } from '@solana/web3.js'

import { wallet } from '../../../global.js'
import {
	driftProgram,
	DRIFT_STATE,
	DRIFT_USER,
	DRIFT_USER_ACCOUNT_ID,
	DRIFT_USER_STATS,
	DRIFT_USER_STATS_INITIALIZED,
} from '../config.js'

export const buildDriftInitializeUserIx = () => {
	const ixs: TransactionInstruction[] = []

	if (!DRIFT_USER_STATS_INITIALIZED) {
		ixs.push(
			driftProgram.instruction.initializeUserStats({
				accounts: {
					userStats: DRIFT_USER_STATS,
					state: DRIFT_STATE,
					authority: wallet.publicKey,
					payer: wallet.publicKey,
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: SystemProgram.programId,
				},
			}),
		)
	}

	const name = Buffer.from('surf' + ' '.repeat(28), 'utf-8')
	ixs.push(
		driftProgram.instruction.initializeUser(DRIFT_USER_ACCOUNT_ID, Array(...name), {
			accounts: {
				user: DRIFT_USER,
				userStats: DRIFT_USER_STATS,
				state: DRIFT_STATE,
				authority: wallet.publicKey,
				payer: wallet.publicKey,
				rent: SYSVAR_RENT_PUBKEY,
				systemProgram: SystemProgram.programId,
			},
		}),
	)

	return ixs
}
