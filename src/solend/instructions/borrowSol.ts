import { TransactionInstruction } from '@solana/web3.js'
import {
	borrowObligationLiquidityInstruction,
	refreshObligationInstruction,
	refreshReserveInstruction,
	SOLEND_PRODUCTION_PROGRAM_ID,
} from '@solendprotocol/solend-sdk'
import BN from 'bn.js'

import { tokenA, wallet } from '../../global.js'
import {
	OBLIGATION_ADDRESS,
	SOLEND_POOL_ADDRESS,
	SOLEND_POOL_AUTHORITY_ADDRESS,
	tokenAReserve,
	tokenBReserve,
} from '../config.js'

export const buildBorrowSolFromSolendIx = (amountRaw: number | BN) => {
	const instructions: TransactionInstruction[] = []

	;[tokenAReserve, tokenBReserve].forEach(({ address, pythOracle, switchboardOracle }) => {
		instructions.push(
			refreshReserveInstruction(
				address,
				SOLEND_PRODUCTION_PROGRAM_ID,
				pythOracle,
				switchboardOracle,
			),
		)
	})

	instructions.push(
		refreshObligationInstruction(OBLIGATION_ADDRESS, [], [], SOLEND_PRODUCTION_PROGRAM_ID),
		borrowObligationLiquidityInstruction(
			amountRaw,
			tokenAReserve.liquidityAddress,
			tokenA.ATAddress,
			tokenAReserve.address,
			tokenAReserve.liquidityFeeReceiverAddress,
			OBLIGATION_ADDRESS,
			SOLEND_POOL_ADDRESS,
			SOLEND_POOL_AUTHORITY_ADDRESS,
			wallet.publicKey,
			SOLEND_PRODUCTION_PROGRAM_ID,
		),
	)

  return instructions
}
