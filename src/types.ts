import { PublicKey } from '@solana/web3.js'
import { PositionMetadata } from './services/orca/types'

export type SavedWhirlpoolPosition = Pick<PositionMetadata, 'ATAddress' | 'PDAddress'> & { mint: PublicKey }

export type SavedWhirlpoolPositionMetadata = {
  price: number
  upperBoundaryPrice: number
  lowerBoundaryPrice: number
  position: SavedWhirlpoolPosition
}

export type State = {
  whirlpool: SavedWhirlpoolPositionMetadata | null
}

export type TokenInfo = {
  mint: PublicKey
  ATAddress: PublicKey
  decimals: number
}
