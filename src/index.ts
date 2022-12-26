import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { ParsableWhirlpool } from '@orca-so/whirlpools-sdk'
import {
	createAssociatedTokenAccountInstruction,
	getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { buildAndSignTxFromInstructions } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { getWhirlpoolData } from './services/orca/getWhirlpoolData.js'
import { connection, wallet } from './global.js'
import { USDC_POSITION_SIZE, WHIRLPOOL_ADDRESS } from './config.js'
import { openHedgedPosition } from './actions/openHedgedPosition.js'
import {
	getPriceFromSqrtPrice,
	getPriceWithBoundariesFromSqrtPrice,
} from './services/orca/helpers/getPriceWithBoundaries.js'
import { retryOnThrow } from './utils/retryOnThrow.js'
import { buildDriftInitializeUserIx } from './services/drift/instructions/initializeUser.js'
import { forceSendTx } from './utils/forceSendTx.js'
import { isPriceInRange } from './services/orca/helpers/isPriceInRange.js'
import { adjustPriceRange } from './actions/adjustPriceRange.js'
import { adjustDriftPosition } from './actions/adjustDriftPosition.js'
import { state } from './state.js'

// Fetch and update whirlpoolData
let whirlpoolData = await getWhirlpoolData()

/* ---- SETUP ---- */
await (async () => {
	const instructions: TransactionInstruction[] = []

	const setupDriftIxs = buildDriftInitializeUserIx()
	instructions.push(...setupDriftIxs)

	// Initialize all ATAs
	const accountsMintsToInitialize: PublicKey[] = []
	const accountsAddressesToInitialize: PublicKey[] = []

	whirlpoolData.rewardInfos.forEach(({ mint }) => {
		if (
			mint.equals(PublicKey.default) ||
			accountsMintsToInitialize.findIndex((_mint) => _mint.equals(mint)) > 0
		) {
			return
		}
		const ATAddress = getAssociatedTokenAddressSync(mint, wallet.publicKey)
		accountsMintsToInitialize.push(mint)
		accountsAddressesToInitialize.push(ATAddress)
	})

	const ATAccountsInfo = await retryOnThrow(() =>
		connection.getMultipleAccountsInfo(accountsAddressesToInitialize),
	)
	ATAccountsInfo.forEach((ai, i) => {
		if (!ai?.data) {
			instructions.push(
				createAssociatedTokenAccountInstruction(
					wallet.publicKey,
					accountsAddressesToInitialize[i],
					wallet.publicKey,
					accountsMintsToInitialize[i],
				),
			)
		}
	})

	if (instructions.length) {
		console.log('Creating accounts')
		await forceSendTx(() =>
			buildAndSignTxFromInstructions(
				{
					signers: [wallet],
					instructions,
				},
				connection,
			),
		)
	}
})()

/* ---- INIT ----
	- Open hedged position
		- deposit to whirlpool
		- hedge on drift
*/
await (async () => {
	console.log('Opening position')
	whirlpoolData = await getWhirlpoolData()
	const { price, upperBoundaryPrice, lowerBoundaryPrice } = getPriceWithBoundariesFromSqrtPrice(
		whirlpoolData.sqrtPrice,
	)
	const { driftPosition, whirlpoolPosition } = await openHedgedPosition({
		usdcAmountRaw: USDC_POSITION_SIZE * 10 ** 6,
		upperBoundaryPrice,
		lowerBoundaryPrice,
		whirlpoolData,
	})

	state.driftPosition = driftPosition
	state.whirlpoolPosition = whirlpoolPosition
	state.lastAdjustmentPrice = price
	console.log(
		'Hedged position opened\n',
		`Current pool price: ${price}\n`,
		`Upper boundary: ${upperBoundaryPrice.toFixed(6)}\n`,
		`Lower boundary: ${lowerBoundaryPrice.toFixed(6)}\n`,
	)
})()

/*
  HEDGE Adjusting
  - keep track of pool price
    - if price is > last_price
      - repay the difference in SOL liquidity between prev and current
    - if price < last_price
      - borrow the difference in SOL

  PRICE RANGE Adjusting
  - if price reaches 80% of the price range
    - close position
    - open position with new price range
    - borrow or repay SOL difference between prev and current position
*/

let adjustingPriceRange = false
let adjustingDriftPosition = false

connection.onAccountChange(WHIRLPOOL_ADDRESS, async (ai) => {
	const _whirlpoolData = ParsableWhirlpool.parse(ai.data)
	if (!_whirlpoolData) {
		return
	}
	whirlpoolData = _whirlpoolData

	// ---- PRICE RANGE ADJUSTING ----
	const {
		price: currentPoolPrice,
		upperBoundaryPrice,
		lowerBoundaryPrice,
	} = getPriceWithBoundariesFromSqrtPrice(whirlpoolData.sqrtPrice)

	console.log('Whirlpool price:', currentPoolPrice)

	const positionInRange = isPriceInRange({
		positionTickLowerIndex: state.whirlpoolPosition.tickLowerIndex,
		positionTickUpperIndex: state.whirlpoolPosition.tickUpperIndex,
		currentPoolPrice,
	})

	if (positionInRange || adjustingDriftPosition) {
		return
	}

	adjustingPriceRange = true

	console.log('Adjusting position price range')
	const adjustedWhirlpoolPosition = await adjustPriceRange({
		whirlpoolPosition: state.whirlpoolPosition,
		currentPrice: currentPoolPrice,
		whirlpoolData,
	})
	state.whirlpoolPosition = adjustedWhirlpoolPosition
	console.log(
		'Adjusted whirlpool position\n',
		`Upper boundary: ${upperBoundaryPrice.toFixed(6)}\n`,
		`Lower boundary: ${lowerBoundaryPrice.toFixed(6)}\n`,
	)

	console.log('Adjusting drift position')
	const adjustedDriftPosition = await adjustDriftPosition({
		driftPosition: state.driftPosition,
		whirlpoolPositionData: state.whirlpoolPosition,
	})
	console.log('New drift position borrowed amount: ', adjustedDriftPosition.borrowAmount)

	state.driftPosition = adjustedDriftPosition
	state.lastAdjustmentPrice = currentPoolPrice
	adjustingPriceRange = false
})

// 30 min
const UPDATE_TIMEOUT = 1000 * 60 * 30

// TODO: collect fees and rewards
// ---- HEDGED POSITION ADJUSTING ----
while (true) {
	await setTimeout(UPDATE_TIMEOUT)

	const currentPoolPrice = getPriceFromSqrtPrice(whirlpoolData.sqrtPrice)
	console.log('Current pool price:', currentPoolPrice)

	if (currentPoolPrice === state.lastAdjustmentPrice || adjustingPriceRange) {
		continue
	}

	adjustingDriftPosition = true

	console.log('Adjusting drift position')
	const adjustedDriftPosition = await adjustDriftPosition({
		driftPosition: state.driftPosition,
		whirlpoolPositionData: state.whirlpoolPosition,
		whirlpoolSqrtPrice: whirlpoolData.sqrtPrice,
	})
	console.log('New drift position borrowed amount: ', adjustedDriftPosition.borrowAmount)

	state.driftPosition = adjustedDriftPosition
	state.lastAdjustmentPrice = currentPoolPrice
	adjustingDriftPosition = false
}
