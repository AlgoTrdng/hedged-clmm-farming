import { AnchorProvider } from '@project-serum/anchor'
import { Connection, Keypair } from '@solana/web3.js'

import {
	LOWER_BOUNDARY_PCT,
	RPC_URL,
	UPPER_BOUNDARY_PCT,
	USDC_POSITION_SIZE,
	WALLET_PRIVATE_KEY,
} from './config/index.js'
import { SOL_MINT, USDC_MINT } from './constants.js'
import { getOrCreateSurfWallet } from './services/wallet/getOrCreateSurfWallet.js'
import { TokenInfo } from './types.js'

export const connection = new Connection(RPC_URL, 'confirmed')

export const userWallet = Keypair.fromSecretKey(WALLET_PRIVATE_KEY)
export const provider = AnchorProvider.env()

export const {
	surfWallet,
	tokenA: tokenAATAccount,
	tokenB: tokenBATAccount,
	driftUser,
	driftUserStats,
} = await getOrCreateSurfWallet()

export const tokenA: TokenInfo = {
	mint: SOL_MINT,
	decimals: 9,
	ATAddress: tokenAATAccount,
}
export const tokenB: TokenInfo = {
	mint: USDC_MINT,
	decimals: 6,
	ATAddress: tokenBATAccount,
}

export const usdcPositionSizeRaw = USDC_POSITION_SIZE * 10 ** 6
export const orcaAmount = Math.floor(usdcPositionSizeRaw * 0.55)
export const collateralAmount = usdcPositionSizeRaw - orcaAmount

export const upperBoundaryBps = UPPER_BOUNDARY_PCT / 100
export const lowerBoundaryBps = LOWER_BOUNDARY_PCT / 100
