import { ComputeBudgetProgram } from '@solana/web3.js'

import { PRIORITY_FEE } from '../config/index.js'

type PriorityFeesParams = {
	units: number
}

export const buildPriorityFeeIxs = ({ units }: PriorityFeesParams) => {
	const unitPrice = (PRIORITY_FEE / units) * 10 ** 6
	return [
		ComputeBudgetProgram.setComputeUnitLimit({ units }),
		ComputeBudgetProgram.setComputeUnitPrice({ microLamports: Math.floor(unitPrice) }),
	]
}
