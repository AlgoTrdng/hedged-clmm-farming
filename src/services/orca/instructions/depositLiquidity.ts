import { WhirlpoolData, IncreaseLiquidityInput, WhirlpoolIx } from '@orca-so/whirlpools-sdk'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

import { WHIRLPOOL_ADDRESS } from '../../../config/index.js'
import { tokenA, tokenB, surfWallet } from '../../../global.js'
import { whirlpoolProgram } from '../config.js'
import { getTickArrays } from '../helpers/getTickArrays.js'

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

	const { tickLowerArrayAddress, tickUpperArrayAddress } = getTickArrays({
		tickLowerIndex,
		tickUpperIndex,
		tickSpacing: whirlpoolData.tickSpacing,
	})

	const { instructions: depositLiquidityIxs } = WhirlpoolIx.increaseLiquidityIx(whirlpoolProgram, {
		liquidityAmount: liquidityInput.liquidityAmount,
		tokenMaxA: liquidityInput.tokenMaxA,
		tokenMaxB: liquidityInput.tokenMaxB,
		whirlpool: WHIRLPOOL_ADDRESS,
		positionAuthority: surfWallet.publicKey,
		position: positionPDAddress,
		positionTokenAccount: positionATAddress,
		tokenOwnerAccountA: tokenA.ATAddress,
		tokenOwnerAccountB: tokenB.ATAddress,
		tokenVaultA: whirlpoolData.tokenVaultA,
		tokenVaultB: whirlpoolData.tokenVaultB,
		tickArrayLower: tickLowerArrayAddress,
		tickArrayUpper: tickUpperArrayAddress,
	})
	instructions.push(...depositLiquidityIxs)

	return instructions
}
