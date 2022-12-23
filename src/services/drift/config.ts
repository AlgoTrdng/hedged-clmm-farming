import {
	DriftClient,
	getDriftSignerPublicKey,
	getDriftStateAccountPublicKey,
	getSpotMarketPublicKey,
	getUserStatsAccountPublicKey,
	getUserAccountPublicKey,
	configs,
	MainnetSpotMarkets,
	SpotMarketAccount,
} from '@drift-labs/sdk'
import { PublicKey } from '@solana/web3.js'

import { IDL } from './idl.js'
import { connection, ctx, tokenA, tokenB, wallet } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'
import { Program } from '@project-serum/anchor'

const DRIFT_PROGRAM_ID = new PublicKey(configs['mainnet-beta'].DRIFT_PROGRAM_ID)

const driftClient = new DriftClient({
	programID: DRIFT_PROGRAM_ID,
	wallet: ctx.wallet,
	connection,
})

export const driftProgram = driftClient.program as unknown as Program<IDL>

export const DRIFT_SIGNER = getDriftSignerPublicKey(DRIFT_PROGRAM_ID)
export const DRIFT_STATE = await getDriftStateAccountPublicKey(DRIFT_PROGRAM_ID)
export const DRIFT_USER = await getUserAccountPublicKey(DRIFT_PROGRAM_ID, wallet.publicKey, 0)
export const DRIFT_USER_STATS = getUserStatsAccountPublicKey(DRIFT_PROGRAM_ID, wallet.publicKey)

const getMarketIndex = (_mint: PublicKey) => {
	const idx = MainnetSpotMarkets.findIndex(({ mint }) => mint.equals(_mint))
	if (idx === -1) {
		throw Error(`Drift spot market for token ${_mint.toString()} does not exist`)
	}
	return idx
}

// SOL spot market -> 1 drift index
export const DRIFT_TOKEN_A_MARKET_INDEX = getMarketIndex(tokenA.mint)
export const DRIFT_TOKEN_A_SPOT_MARKET = await getSpotMarketPublicKey(
	DRIFT_PROGRAM_ID,
	DRIFT_TOKEN_A_MARKET_INDEX,
)
// USDC Spot market -> 0 drift index
export const DRIFT_TOKEN_B_MARKET_INDEX = getMarketIndex(tokenB.mint)
export const DRIFT_TOKEN_B_SPOT_MARKET = await getSpotMarketPublicKey(
	DRIFT_PROGRAM_ID,
	DRIFT_TOKEN_B_MARKET_INDEX,
)

const spotMarketsAccounts = (
	await retryOnThrow(() =>
		connection.getMultipleAccountsInfo([DRIFT_TOKEN_A_SPOT_MARKET, DRIFT_TOKEN_B_SPOT_MARKET]),
	)
).map((ai, i) => {
	if (!ai) {
		throw Error(`Could not fetch account info for Drift spot market: ${i}`)
	}
	return driftClient.program.account.spotMarket.coder.accounts.decode(
		'SpotMarket',
		ai.data,
	) as SpotMarketAccount
})

export const DRIFT_TOKEN_A_SPOT_VAULT = spotMarketsAccounts[0].vault
export const DRIFT_TOKEN_B_SPOT_VAULT = spotMarketsAccounts[1].vault
