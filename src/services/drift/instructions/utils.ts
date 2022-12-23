import { PublicKey } from '@solana/web3.js'

import { tokenA, tokenB } from '../../../global.js'
import {
	DRIFT_TOKEN_A_MARKET_INDEX,
	DRIFT_TOKEN_A_SPOT_VAULT,
	DRIFT_TOKEN_B_MARKET_INDEX,
	DRIFT_TOKEN_B_SPOT_VAULT,
} from '../config.js'

export const mapTokenToMarket = (tokenMint: string): [number, PublicKey] => {
	switch (tokenMint) {
		case tokenA.mint.toString(): {
			return [DRIFT_TOKEN_A_MARKET_INDEX, DRIFT_TOKEN_A_SPOT_VAULT]
		}
		case tokenB.mint.toString(): {
			return [DRIFT_TOKEN_B_MARKET_INDEX, DRIFT_TOKEN_B_SPOT_VAULT]
		}
		default: {
			throw Error(`Market for token ${tokenMint.toString()} does not exist`)
		}
	}
}
