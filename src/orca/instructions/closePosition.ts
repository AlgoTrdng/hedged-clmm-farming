import { WhirlpoolIx } from '@orca-so/whirlpools-sdk'

import { ctx, wallet } from '../../global.js'
import { PositionMetadata } from '../types.js'

export const buildCloseWhirlpoolPositionIx = (positionMetadata: PositionMetadata) => {
	const { instructions: closePositionIx } = WhirlpoolIx.closePositionIx(ctx.program, {
		positionAuthority: wallet.publicKey,
		receiver: wallet.publicKey,
		positionTokenAccount: positionMetadata.ATAddress,
		position: positionMetadata.PDAddress,
		positionMint: positionMetadata.positionMint,
	})
	return closePositionIx
}
