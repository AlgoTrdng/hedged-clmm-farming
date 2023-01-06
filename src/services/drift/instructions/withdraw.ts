import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'

import { driftUser, driftUserStats, surfWallet } from '../../../global.js'
import { TokenInfo } from '../../../types.js'
import { driftProgram, DRIFT_SIGNER, DRIFT_STATE } from '../config.js'
import { buildAdditionalAccounts, mapTokenToMarket } from './utils.js'

export type BuildDriftWithdrawIxParams = {
	amountRaw: number | BN
	token: TokenInfo
	borrow: boolean
}

export const buildDriftWithdrawIx = ({ amountRaw, token, borrow }: BuildDriftWithdrawIxParams) => {
	const [marketIndex, marketVault] = mapTokenToMarket(token.mint.toString())
	const additionalAccounts = buildAdditionalAccounts(marketIndex)

	const ix = driftProgram.instruction.withdraw(marketIndex, new BN(amountRaw), !borrow, {
		accounts: {
			state: DRIFT_STATE,
			user: driftUser,
			userStats: driftUserStats,
			authority: surfWallet.publicKey,
			spotMarketVault: marketVault,
			driftSigner: DRIFT_SIGNER,
			userTokenAccount: token.ATAddress,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
		remainingAccounts: additionalAccounts,
	})

	return ix
}
