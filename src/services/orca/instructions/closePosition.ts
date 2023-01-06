import { WhirlpoolIx } from '@orca-so/whirlpools-sdk'

import { ctx, surfWallet } from '../../../global.js'
import { WhirlpoolPosition } from '../../../state.js'

export const buildCloseWhirlpoolPositionIx = ({
	ATAddress,
	PDAddress,
	positionMint,
}: Pick<WhirlpoolPosition, 'ATAddress' | 'PDAddress' | 'positionMint'>) => {
	const { instructions: closePositionIx } = WhirlpoolIx.closePositionIx(ctx.program, {
		positionAuthority: surfWallet.publicKey,
		receiver: surfWallet.publicKey,
		positionTokenAccount: ATAddress,
		position: PDAddress,
		positionMint: positionMint,
	})
	return closePositionIx
}
