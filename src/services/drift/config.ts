import {
	DriftClient,
	getDriftSignerPublicKey,
	getDriftStateAccountPublicKey,
	getSpotMarketPublicKey,
	configs,
	MainnetSpotMarkets,
	SpotMarketAccount,
} from '@drift-labs/sdk'
import { PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'

import { IDL } from './idl.js'
import { connection, surfWallet, tokenA, tokenB } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'

export const DRIFT_PROGRAM_ID = new PublicKey(configs['mainnet-beta'].DRIFT_PROGRAM_ID)

const driftClient = new DriftClient({
	programID: DRIFT_PROGRAM_ID,
	wallet: {
		async signTransaction(tx) {
			tx.partialSign(surfWallet)
			return tx
		},
		async signAllTransactions(txs) {
			return txs.map((tx) => {
				tx.partialSign(surfWallet)
				return tx
			})
		},
		publicKey: surfWallet.publicKey,
	},
	connection,
})

export const driftProgram = driftClient.program as unknown as Program<IDL>

export const DRIFT_SIGNER = getDriftSignerPublicKey(DRIFT_PROGRAM_ID)
export const DRIFT_STATE = await getDriftStateAccountPublicKey(DRIFT_PROGRAM_ID)

console.log('Fetching drift data')
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

const [tokenASpotMarket, tokenBSpotMarket] = (
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

export { tokenASpotMarket, tokenBSpotMarket }

export const DRIFT_TOKEN_A_SPOT_VAULT = tokenASpotMarket.vault
export const DRIFT_TOKEN_B_SPOT_VAULT = tokenBSpotMarket.vault

export const DRIFT_TOKEN_A_ORACLE = tokenASpotMarket.oracle
