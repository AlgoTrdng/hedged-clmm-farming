import { WhirlpoolIx } from '@orca-so/whirlpools-sdk'

import { ctx, wallet } from '../../../global.js'
import { WhirlpoolPosition } from '../../../state.js'

export const buildCloseWhirlpoolPositionIx = ({
	ATAddress,
	PDAddress,
	positionMint,
}: Pick<WhirlpoolPosition, 'ATAddress' | 'PDAddress' | 'positionMint'>) => {
	const { instructions: closePositionIx } = WhirlpoolIx.closePositionIx(ctx.program, {
		positionAuthority: wallet.publicKey,
		receiver: wallet.publicKey,
		positionTokenAccount: ATAddress,
		position: PDAddress,
		positionMint: positionMint,
	})
	return closePositionIx
}
