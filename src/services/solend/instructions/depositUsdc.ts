import { createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { SystemProgram, TransactionInstruction } from '@solana/web3.js'
import {
	depositReserveLiquidityAndObligationCollateralInstruction,
	SOLEND_PRODUCTION_PROGRAM_ID,
	OBLIGATION_SIZE,
	initObligationInstruction,
} from '@solendprotocol/solend-sdk'
import BN from 'bn.js'

import { connection, tokenB, userWallet } from '../../../global.js'
import { retryOnThrow } from '../../../utils/retryOnThrow.js'
import {
	OBLIGATION_ADDRESS,
	OBLIGATION_ADDRESS_SEED,
	SOLEND_POOL_ADDRESS,
	SOLEND_POOL_AUTHORITY_ADDRESS,
	tokenBReserve,
} from '../config.js'

export const buildDepositUsdcToSolendIx = async (amountRaw: number | BN) => {
	const instructions: TransactionInstruction[] = []

	const [obligationAccountInfo, collateralATAccountInfo] = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo([OBLIGATION_ADDRESS, tokenBReserve.collateralATAddress]),
	)

	if (!obligationAccountInfo) {
		const obligationAccountRent = await retryOnThrow(() =>
			connection.getMinimumBalanceForRentExemption(OBLIGATION_SIZE),
		)
		instructions.push(
			SystemProgram.createAccountWithSeed({
				fromPubkey: userWallet.publicKey,
				newAccountPubkey: OBLIGATION_ADDRESS,
				basePubkey: userWallet.publicKey,
				seed: OBLIGATION_ADDRESS_SEED,
				lamports: obligationAccountRent,
				space: OBLIGATION_SIZE,
				programId: SOLEND_PRODUCTION_PROGRAM_ID,
			}),
			initObligationInstruction(
				OBLIGATION_ADDRESS,
				SOLEND_POOL_ADDRESS,
				userWallet.publicKey,
				SOLEND_PRODUCTION_PROGRAM_ID,
			),
		)
	}

	if (!collateralATAccountInfo) {
		instructions.push(
			createAssociatedTokenAccountInstruction(
				userWallet.publicKey,
				tokenBReserve.collateralATAddress,
				userWallet.publicKey,
				tokenBReserve.collateralMintAddress,
			),
		)
	}

	instructions.push(
		depositReserveLiquidityAndObligationCollateralInstruction(
			amountRaw,
			tokenB.ATAddress,
			tokenBReserve.collateralATAddress,
			tokenBReserve.address,
			tokenBReserve.liquidityAddress,
			tokenBReserve.collateralMintAddress,
			SOLEND_POOL_ADDRESS,
			SOLEND_POOL_AUTHORITY_ADDRESS,
			tokenBReserve.collateralSupplyAddress,
			OBLIGATION_ADDRESS,
			userWallet.publicKey,
			tokenBReserve.pythOracle,
			tokenBReserve.switchboardOracle,
			userWallet.publicKey,
			SOLEND_PRODUCTION_PROGRAM_ID,
		),
	)

	return instructions
}
