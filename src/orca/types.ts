import { PositionData } from '@orca-so/whirlpools-sdk'
import { PublicKey } from '@solana/web3.js'

export type PositionMetadata = {
	PDAddress: PublicKey
	ATAddress: PublicKey
} & PositionData
