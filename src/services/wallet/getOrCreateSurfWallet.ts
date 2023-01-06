import { getUserAccountPublicKey, getUserStatsAccountPublicKey, configs } from '@drift-labs/sdk'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import fs from 'node:fs/promises'

import { SURF_WALLET_CACHE } from '../../config/index.js'
import { SOL_MINT, USDC_MINT } from '../../constants.js'

const DRIFT_PROGRAM_ID = new PublicKey(configs['mainnet-beta'].DRIFT_PROGRAM_ID)

const getATAccounts = (wallet: PublicKey) => ({
	tokenA: getAssociatedTokenAddressSync(SOL_MINT, wallet),
	tokenB: getAssociatedTokenAddressSync(USDC_MINT, wallet),
})

type SurfWalletCache = {
	wallet: number[]
	driftUserStats: string
	driftUser: string
}

const parseCache = (cache: SurfWalletCache) => ({
	wallet: new Uint8Array(cache.wallet),
	driftUserStats: new PublicKey(cache.driftUserStats),
	driftUser: new PublicKey(cache.driftUser),
})

const readSurfWalletCache = async () => {
	try {
		const surfWalletCache = await fs.readFile(SURF_WALLET_CACHE, { encoding: 'utf-8' })
		if (!surfWalletCache.length) {
			return null
		}
		try {
			const cache = JSON.parse(surfWalletCache)
			const parsed = parseCache(cache)
			return parsed
		} catch {
			console.error(
				'Please make sure surf wallet cache file is correct\n',
				`Location: ${SURF_WALLET_CACHE}`,
			)
		}
	} catch {
		return null
	}
	throw Error('Invalid surf wallet cache')
}

export const getOrCreateSurfWallet = async () => {
	const surfWalletCache = await readSurfWalletCache()

	if (!surfWalletCache) {
		const surfWallet = new Keypair()

		const driftUserStats = getUserStatsAccountPublicKey(DRIFT_PROGRAM_ID, surfWallet.publicKey)
		const driftUser = await getUserAccountPublicKey(DRIFT_PROGRAM_ID, surfWallet.publicKey, 0)
		const surfWalletCache: SurfWalletCache = {
			wallet: Array<number>(...surfWallet.secretKey),
			driftUserStats: driftUserStats.toString(),
			driftUser: driftUser.toString(),
		}

		await fs.writeFile(SURF_WALLET_CACHE, JSON.stringify(surfWalletCache, null, 2))

		console.log(
			'Created new surf wallet\n',
			`Saved the private key in: ${SURF_WALLET_CACHE}\n`,
			`Wallet address: ${surfWallet.publicKey.toString()}`,
		)

		return {
			...getATAccounts(surfWallet.publicKey),
			surfWallet,
			driftUserStats,
			driftUser,
		}
	}

	const { wallet, driftUser, driftUserStats } = surfWalletCache

	const surfWallet = Keypair.fromSecretKey(wallet)

	console.log(
		'Using saved surf wallet\n',
		`Saved in: ${SURF_WALLET_CACHE}\n`,
		`Wallet address: ${surfWallet.publicKey.toString()}`,
	)

	return {
		...getATAccounts(surfWallet.publicKey),
		surfWallet,
		driftUserStats,
		driftUser,
	}
}
