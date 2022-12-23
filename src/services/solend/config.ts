import fetch from 'node-fetch'
import { ConfigType, SOLEND_PRODUCTION_PROGRAM_ID } from '@solendprotocol/solend-sdk'
import { PublicKey } from '@solana/web3.js'

import { tokenA, tokenB, wallet } from '../../global.js'
import { retryOnThrow } from '../../utils/retryOnThrow.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'

const SOLEND_API_URL = 'https://api.solend.fi/v1/markets/configs?scope=all&deployment=production'
const POOL_NAME = 'TURBO SOL'

const res = await retryOnThrow(
	async () => (await fetch(SOLEND_API_URL)).json() as Promise<ConfigType>,
)
const pool = res.find(({ name }) => name === POOL_NAME)

if (!pool) {
	throw Error('Can not find Solend pool')
}

export const SOLEND_POOL_ADDRESS = new PublicKey(pool.address)
export const SOLEND_POOL_AUTHORITY_ADDRESS = new PublicKey(pool.authorityAddress)
export const OBLIGATION_ADDRESS_SEED = pool.address.slice(0, 32)
export const OBLIGATION_ADDRESS = await PublicKey.createWithSeed(
	wallet.publicKey,
	OBLIGATION_ADDRESS_SEED,
	SOLEND_PRODUCTION_PROGRAM_ID,
)

const parseTokenReserveData = (mint: PublicKey) => {
	const reserve = pool.reserves.find(
		({ liquidityToken }) => liquidityToken.mint === mint.toString(),
	)
	if (!reserve) {
		throw Error(`Could not find reserve with mint: ${mint.toString()}`)
	}
	const collateralMintAddress = new PublicKey(reserve.collateralMintAddress)
	const collateralATAddress = getAssociatedTokenAddressSync(collateralMintAddress, wallet.publicKey)
	return {
		pythOracle: new PublicKey(reserve.pythOracle),
		switchboardOracle: new PublicKey(reserve.switchboardOracle),
		address: new PublicKey(reserve.address),
		collateralSupplyAddress: new PublicKey(reserve.collateralSupplyAddress),
		liquidityAddress: new PublicKey(reserve.liquidityAddress),
		liquidityFeeReceiverAddress: new PublicKey(reserve.liquidityFeeReceiverAddress),
		collateralMintAddress,
		collateralATAddress,
	}
}

export const tokenAReserve = parseTokenReserveData(tokenA.mint)
export const tokenBReserve = parseTokenReserveData(tokenB.mint)
