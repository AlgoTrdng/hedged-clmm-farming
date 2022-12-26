import { PublicKey } from '@solana/web3.js'

export type TokenInfo = {
	mint: PublicKey
	ATAddress: PublicKey
	decimals: number
}

export type Balances = {
	tokenA: number
	tokenB: number
}
