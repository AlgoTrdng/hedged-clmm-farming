import { PositionData } from '@orca-so/whirlpools-sdk'
import { PublicKey } from '@solana/web3.js'

export type PositionAddresses = Record<'positionMint' | 'PDAddress' | 'ATAddress', PublicKey>

export type WhirlpoolPosition = Pick<
	PositionData,
	'liquidity' | 'tickLowerIndex' | 'tickUpperIndex'
> &
	PositionAddresses

export type DriftPosition = {
	collateralAmount: number
	borrowAmount: number
}

export type State =
	| {
			whirlpoolPosition: WhirlpoolPosition
			priceMoveWithoutDriftAdjustment: number
			driftPosition: DriftPosition
			lastAdjustmentPrice: number
	  }
	| Record<string, never>

export const state: State = {}
