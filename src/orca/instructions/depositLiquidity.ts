import {
	WhirlpoolData,
	IncreaseLiquidityInput,
	PDAUtil,
	ORCA_WHIRLPOOL_PROGRAM_ID,
	WhirlpoolIx,
} from '@orca-so/whirlpools-sdk'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

import { WHIRLPOOL_ADDRESS } from '../../config.js'
import { tokenA, tokenB, wallet, ctx } from '../../global.js'

type BuildDepositLiquidityIxParams = {
	whirlpoolData: WhirlpoolData
	tickLowerIndex: number
	tickUpperIndex: number
	liquidityInput: IncreaseLiquidityInput
	positionPDAddress: PublicKey
	positionATAddress: PublicKey
}

export const buildDepositLiquidityIx = ({
	whirlpoolData,
	tickLowerIndex,
	tickUpperIndex,
	liquidityInput,
	positionPDAddress,
	positionATAddress,
}: BuildDepositLiquidityIxParams) => {
	const instructions: TransactionInstruction[] = []

	const tickArrayLower = PDAUtil.getTickArrayFromTickIndex(
		tickLowerIndex,
		whirlpoolData.tickSpacing,
		WHIRLPOOL_ADDRESS,
		ORCA_WHIRLPOOL_PROGRAM_ID,
	)
	const tickArrayUpper = PDAUtil.getTickArrayFromTickIndex(
		tickUpperIndex,
		whirlpoolData.tickSpacing,
		WHIRLPOOL_ADDRESS,
		ORCA_WHIRLPOOL_PROGRAM_ID,
	)

	const { instructions: depositLiquidityIxs } = WhirlpoolIx.increaseLiquidityIx(ctx.program, {
		liquidityAmount: liquidityInput.liquidityAmount,
		tokenMaxA: liquidityInput.tokenMaxA,
		tokenMaxB: liquidityInput.tokenMaxB,
		whirlpool: WHIRLPOOL_ADDRESS,
		positionAuthority: wallet.publicKey,
		position: positionPDAddress,
		positionTokenAccount: positionATAddress,
		tokenOwnerAccountA: tokenA.ATAddress,
		tokenOwnerAccountB: tokenB.ATAddress,
		tokenVaultA: whirlpoolData.tokenVaultA,
		tokenVaultB: whirlpoolData.tokenVaultB,
		tickArrayLower: tickArrayLower.publicKey,
		tickArrayUpper: tickArrayUpper.publicKey,
	})
	instructions.push(...depositLiquidityIxs)

	return instructions
}
