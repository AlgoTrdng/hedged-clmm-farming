import { ComputeBudgetProgram } from '@solana/web3.js'

type PriorityFeesParams = {
	units: number
	unitPrice: number
}

export const buildPriorityFeeIxs = ({ units, unitPrice }: PriorityFeesParams) => [
	ComputeBudgetProgram.setComputeUnitLimit({ units }),
	ComputeBudgetProgram.setComputeUnitPrice({ microLamports: unitPrice }),
]
