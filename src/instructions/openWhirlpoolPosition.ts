import {
	increaseLiquidityQuoteByInputTokenWithParams,
	WhirlpoolData,
} from '@orca-so/whirlpools-sdk'
import { Signer, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'

import { SLIPPAGE_TOLERANCE } from '../constants.js'
import { tokenB } from '../global.js'
import { getBoundariesTickIndexes } from '../services/orca/helpers/getBoundariesTickIndex.js'
import { buildCreatePositionIx } from '../services/orca/instructions/createPosition.js'
import { buildDepositLiquidityIx } from '../services/orca/instructions/depositLiquidity.js'
import { buildInitTickArrayIx } from '../services/orca/instructions/initTickArray.js'
import { WhirlpoolPosition } from '../state.js'
import { Balances } from '../types.js'

type BuildOpenWhirlpoolPositionIxParams = {
	whirlpoolData: WhirlpoolData
	amountRaw: number
	upperBoundaryPrice: number
	lowerBoundaryPrice: number
}

type BuildOpenWhirlpoolPositionIxReturn = WhirlpoolPosition & {
	instructions: TransactionInstruction[]
	additionalSigners: Signer[]
	depositAmounts: Balances
}

export const buildOpenWhirlpoolPositionIx = async ({
	whirlpoolData,
	amountRaw,
	upperBoundaryPrice,
	lowerBoundaryPrice,
}: BuildOpenWhirlpoolPositionIxParams): Promise<BuildOpenWhirlpoolPositionIxReturn> => {
	const priceRangeTickIndexes = getBoundariesTickIndexes({
		tickSpacing: whirlpoolData.tickSpacing,
		upperBoundary: upperBoundaryPrice,
		lowerBoundary: lowerBoundaryPrice,
	})
	const { tickLowerIndex, tickUpperIndex } = priceRangeTickIndexes
	const liquidityInput = increaseLiquidityQuoteByInputTokenWithParams({
		inputTokenMint: tokenB.mint,
		inputTokenAmount: new BN(amountRaw * 0.5),
		slippageTolerance: SLIPPAGE_TOLERANCE,
		tickLowerIndex,
		tickUpperIndex,
		...whirlpoolData,
	})

	// Deposit to ORCA
	const initTickArrayIxs = await buildInitTickArrayIx(whirlpoolData)
	const {
		instruction: createPositionIx,
		signers,
		...positionAddresses
	} = buildCreatePositionIx({
		tickLowerIndex,
		tickUpperIndex,
	})
	const depositLiquidityIxs = buildDepositLiquidityIx({
		positionATAddress: positionAddresses.ATAddress,
		positionPDAddress: positionAddresses.PDAddress,
		whirlpoolData,
		tickLowerIndex,
		tickUpperIndex,
		liquidityInput,
	})

	return {
		instructions: [...initTickArrayIxs, createPositionIx, ...depositLiquidityIxs],
		additionalSigners: signers,
		depositAmounts: {
			tokenA: liquidityInput.tokenEstA.toNumber(),
			tokenB: liquidityInput.tokenEstB.toNumber(),
		},
		liquidity: liquidityInput.liquidityAmount,
		tickLowerIndex,
		tickUpperIndex,
		...positionAddresses,
	}
}
