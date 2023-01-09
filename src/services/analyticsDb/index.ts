import fs from 'node:fs/promises'
import { z } from 'zod'

import { ANALYTICS } from '../../config/index.js'

const tokenBalancesSchema = z.object({
	whirlpool: z.number(),
	drift: z.number(),
	wallet: z.number(),
	rewardsAndFees: z.number(),
})

const snapshotSchema = z.object({
	whirlpoolPrice: z.number().gt(0),
	balances: z.object({
		tokenA: tokenBalancesSchema,
		tokenB: tokenBalancesSchema,
	}),
	aggregatedBalances: z.object({
		tokenA: z.number(),
		tokenB: z.number(),
	}),
	totalInUsdc: z.number(),
	timestamp: z.number().gt(0),
})

const analyticsSchema = z.array(snapshotSchema)

export type SnapshotData = z.infer<typeof snapshotSchema>

export const readAnalytics = async () => {
	try {
		const savedStr = await fs.readFile(ANALYTICS, { encoding: 'utf-8' })
		const parsed = JSON.parse(savedStr)
		const res = analyticsSchema.safeParse(parsed)
		return res.success ? res.data : []
	} catch (e) {
		return []
	}
}

export const updateAnalytics = async (data: SnapshotData) => {
	const existingData = await readAnalytics()
	existingData.push(data)
	await fs.writeFile(ANALYTICS, JSON.stringify(existingData, null, 2))
}
