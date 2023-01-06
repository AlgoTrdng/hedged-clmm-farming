import { PublicKey } from '@solana/web3.js'
import { z } from 'zod'

export const envConfigSchema = z.object({
	ANCHOR_PROVIDER_URL: z.string().min(1),
	ANCHOR_WALLET: z.string().min(1),
	SURF_WALLET_CACHE: z.string().min(1),
})

export const configSchema = z.object({
	whirlpoolAddress: z
		.string()
		.min(1)
		.transform((addr) => new PublicKey(addr)),
	upperBoundaryPct: z.number().min(0),
	lowerBoundaryPct: z.number().min(0),
	usdcPositionSize: z.number().gt(0),
})
