import { PublicKey } from '@solana/web3.js'
import { z } from 'zod'
import fs from 'node:fs/promises'
import BN from 'bn.js'

import { DB_DATA } from './config/index.js'

const stateSchema = z.object({
	whirlpoolPosition: z.object({
		positionMint: z.string().transform((addr) => new PublicKey(addr)),
		PDAddress: z.string().transform((addr) => new PublicKey(addr)),
		ATAddress: z.string().transform((addr) => new PublicKey(addr)),
		liquidity: z.string().transform((bn) => new BN(bn)),
		tickLowerIndex: z.number(),
		tickUpperIndex: z.number(),
	}),
	priceMoveWithoutDriftAdjustment: z.number().min(0),
	driftPosition: z.object({
		collateralAmount: z.number().min(0),
		borrowAmount: z.number().min(0),
	}),
	lastAdjustmentPrice: z.number().min(0),
})

type EmptyState = Record<string, never>
type NonEmptyState = z.infer<typeof stateSchema>
export type State = NonEmptyState | EmptyState

export type PositionAddresses = Pick<
	NonEmptyState['whirlpoolPosition'],
	'ATAddress' | 'PDAddress' | 'positionMint'
>
export type WhirlpoolPosition = NonEmptyState['whirlpoolPosition']
export type DriftPosition = NonEmptyState['driftPosition']

export const state: State = {}

export const loadState = async () => {
	try {
		const dbData = await fs.readFile(DB_DATA, { encoding: 'utf-8' })
		const parsed = stateSchema.parse(JSON.parse(dbData))
		Object.assign<Record<string, never>, NonEmptyState>(state, parsed)
	} catch {}
}

export const setState = async (updatedState: Partial<NonEmptyState>) => {
	Object.assign(state, updatedState)

	const _state = state as unknown as NonEmptyState
	const toSerialize: NonEmptyState = {
		..._state,
		whirlpoolPosition: { ...(_state?.whirlpoolPosition || {}) },
	}
	if (toSerialize.whirlpoolPosition.liquidity) {
		// @ts-ignore
		toSerialize.whirlpoolPosition.liquidity = toSerialize.whirlpoolPosition.liquidity.toString()
	}

	await fs.writeFile(DB_DATA, JSON.stringify(toSerialize, null, 2))
}
