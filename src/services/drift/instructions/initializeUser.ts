import { SYSVAR_RENT_PUBKEY, SystemProgram, TransactionInstruction } from '@solana/web3.js'

import { connection, wallet } from '../../../global.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import { driftProgram, DRIFT_STATE, DRIFT_USER, DRIFT_USER_STATS } from '../config.js'

export const buildDriftInitializeUserIx = async () => {
	const [userStatsAI, userAI] = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo([DRIFT_USER_STATS, DRIFT_USER]),
	)

	const ixs: TransactionInstruction[] = []
	if (!userStatsAI?.data) {
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
	if (!userAI?.data) {
		const name = Buffer.from('surf' + ' '.repeat(28), 'utf-8')
		ixs.push(
			driftProgram.instruction.initializeUser(0, Array(...name), {
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
	}

  return ixs
}
