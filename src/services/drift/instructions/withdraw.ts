import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { BN } from 'bn.js'

import { wallet } from '../../../global.js'
import { TokenInfo } from '../../../types.js'
import { driftProgram, DRIFT_SIGNER, DRIFT_STATE, DRIFT_USER, DRIFT_USER_STATS } from '../config.js'
import { mapTokenToMarket } from './utils.js'

export type BuildDriftWithdrawIxParams = {
	amountRaw: number
	token: TokenInfo
	borrow: boolean
}

export const buildDriftWithdrawIx = ({ amountRaw, token, borrow }: BuildDriftWithdrawIxParams) => {
	const [marketIndex, marketVault] = mapTokenToMarket(token.mint.toString())

	const ix = driftProgram.instruction.withdraw(marketIndex, new BN(amountRaw), borrow, {
		accounts: {
			state: DRIFT_STATE,
			user: DRIFT_USER,
			userStats: DRIFT_USER_STATS,
			authority: wallet.publicKey,
			spotMarketVault: marketVault,
			driftSigner: DRIFT_SIGNER,
			userTokenAccount: token.ATAddress,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
	})

  return ix
}
