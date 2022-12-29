import { PDAUtil, ORCA_WHIRLPOOL_PROGRAM_ID, WhirlpoolIx } from '@orca-so/whirlpools-sdk'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'

import { WHIRLPOOL_ADDRESS } from '../../../config/index.js'
import { wallet, ctx } from '../../../global.js'

type BuildCreatePositionIxParams = {
	tickLowerIndex: number
	tickUpperIndex: number
}

export const buildCreatePositionIx = ({
	tickLowerIndex,
	tickUpperIndex,
}: BuildCreatePositionIxParams) => {
	const positionMintKeypair = new Keypair()
	const positionPDAddress = PDAUtil.getPosition(
		ORCA_WHIRLPOOL_PROGRAM_ID,
		positionMintKeypair.publicKey,
	)

	const positionATAddress = getAssociatedTokenAddressSync(
		positionMintKeypair.publicKey,
		wallet.publicKey,
	)

	const { instructions } = WhirlpoolIx.openPositionIx(ctx.program, {
		funder: wallet.publicKey,
		owner: wallet.publicKey,
		positionPda: positionPDAddress,
		positionMintAddress: positionMintKeypair.publicKey,
		positionTokenAccount: positionATAddress,
		whirlpool: WHIRLPOOL_ADDRESS,
		tickLowerIndex,
		tickUpperIndex,
	})

	return {
		instruction: instructions[0],
		signers: [positionMintKeypair],
		positionMint: positionMintKeypair.publicKey,
		PDAddress: positionPDAddress.publicKey,
		ATAddress: positionATAddress,
	}
}
