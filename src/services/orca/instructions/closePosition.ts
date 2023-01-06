import { WhirlpoolIx } from '@orca-so/whirlpools-sdk'

import { surfWallet } from '../../../global.js'
import { WhirlpoolPosition } from '../../../state.js'
import { whirlpoolProgram } from '../config.js'

export const buildCloseWhirlpoolPositionIx = ({
	ATAddress,
	PDAddress,
	positionMint,
}: Pick<WhirlpoolPosition, 'ATAddress' | 'PDAddress' | 'positionMint'>) => {
	const { instructions: closePositionIx } = WhirlpoolIx.closePositionIx(whirlpoolProgram, {
		positionAuthority: surfWallet.publicKey,
		receiver: surfWallet.publicKey,
		positionTokenAccount: ATAddress,
		position: PDAddress,
		positionMint: positionMint,
	})
	return closePositionIx
}
