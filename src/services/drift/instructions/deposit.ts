import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'

import { wallet } from '../../../global.js'
import { TokenInfo } from '../../../types.js'
import { driftProgram, DRIFT_STATE, DRIFT_USER, DRIFT_USER_STATS } from '../config.js'
import { buildAdditionalAccounts, mapTokenToMarket } from './utils.js'

type BuildDriftDepositIxParams = {
	amountRaw: number | BN
	token: TokenInfo
	repay: boolean
}

export const buildDriftDepositIx = ({ amountRaw, token, repay }: BuildDriftDepositIxParams) => {
	const [marketIndex, marketVault] = mapTokenToMarket(token.mint.toString())
	const additionalAccounts = buildAdditionalAccounts(marketIndex)

	const ix = driftProgram.instruction.deposit(marketIndex, new BN(amountRaw), repay, {
		accounts: {
			state: DRIFT_STATE,
			user: DRIFT_USER,
			userStats: DRIFT_USER_STATS,
			authority: wallet.publicKey,
			spotMarketVault: marketVault,
			userTokenAccount: token.ATAddress,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
		remainingAccounts: additionalAccounts,
	})

	return ix
}
