import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
	AddressLookupTableProgram,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
} from '@solana/web3.js'
import fs from 'node:fs/promises'
import path from 'node:path'

import { rootDir } from '../src/config.js'
import { connection, wallet } from '../src/global.js'
import {
	sendAndConfirmTransaction,
	VersionedTxWithLastValidBlockHeight,
} from '../src/solana/sendTransaction.js'
import {
	SOLEND_POOL_ADDRESS,
	SOLEND_POOL_AUTHORITY_ADDRESS,
	tokenAReserve,
	tokenBReserve,
} from '../src/solend/config.js'
import { retryOnThrow } from '../src/utils/retryOnThrow.js'

const addresses: PublicKey[] = [
	TOKEN_PROGRAM_ID,

	// TURBO SOL
	SOLEND_POOL_ADDRESS,
	SOLEND_POOL_AUTHORITY_ADDRESS,

	tokenAReserve.pythOracle,
	tokenAReserve.switchboardOracle,
	tokenAReserve.address,
	tokenAReserve.collateralSupplyAddress,
	tokenAReserve.liquidityAddress,
	tokenAReserve.liquidityFeeReceiverAddress,
	tokenAReserve.collateralMintAddress,

	tokenBReserve.pythOracle,
	tokenBReserve.switchboardOracle,
	tokenBReserve.address,
	tokenBReserve.collateralSupplyAddress,
	tokenBReserve.liquidityAddress,
	tokenBReserve.liquidityFeeReceiverAddress,
	tokenBReserve.collateralMintAddress,
]

const slot = await retryOnThrow(() => connection.getSlot())

const [createALTIx, ALTAddress] = AddressLookupTableProgram.createLookupTable({
	authority: wallet.publicKey,
	payer: wallet.publicKey,
	recentSlot: slot,
})

const extendALTIx = AddressLookupTableProgram.extendLookupTable({
	payer: wallet.publicKey,
	authority: wallet.publicKey,
	lookupTable: ALTAddress,
	addresses,
})

const { blockhash, lastValidBlockHeight } = await retryOnThrow(() =>
	connection.getLatestBlockhash(),
)

const txMessage = new TransactionMessage({
	instructions: [createALTIx, extendALTIx],
	payerKey: wallet.publicKey,
	recentBlockhash: blockhash,
}).compileToV0Message()
const tx = new VersionedTransaction(txMessage) as VersionedTxWithLastValidBlockHeight
tx.lastValidBlockHeight = lastValidBlockHeight

tx.sign([wallet])

await sendAndConfirmTransaction(tx)
await fs.writeFile(path.join(rootDir, './alt.json'), JSON.stringify({
  address: ALTAddress,
}))

console.log(`Address lookup table created\n Address: ${ALTAddress.toString()}`)
