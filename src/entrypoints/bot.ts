import { buildAndSignTxFromInstructions } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'
import { ComputeBudgetProgram } from '@solana/web3.js'

import { adjustDriftPosition } from '../actions/adjustDriftPosition.js'
import { adjustPriceRange } from '../actions/adjustPriceRange.js'
import { openHedgedPosition } from '../actions/openHedgedPosition.js'
import { DB_DATA, USDC_POSITION_SIZE } from '../config/index.js'
import { userWallet, connection, surfWallet, updateMethod } from '../global.js'
import { buildDriftInitializeUserIx } from '../services/drift/instructions/initializeUser.js'
import { initWhirlpoolState } from '../services/orca/getWhirlpoolData.js'
import { isPriceInRange } from '../services/orca/helpers/isPriceInRange.js'
import {
	getPriceWithBoundariesFromSqrtPrice,
	getBoundariesFromTickIndexes,
	getAllowedPriceMoveFromBoundaries,
} from '../services/orca/helpers/priceHelpers.js'
import { loadState, setState, state } from '../state.js'
import { forceSendTx } from '../utils/forceSendTx.js'
import { buildCreateATAccountsIxs } from '../services/wallet/createATAccounts.js'
import { buildDepositToSurfWalletIxs } from '../services/wallet/transferTokens.js'

let resume = false

await loadState()
if (Object.keys(state).length < 4) {
	resume = false
} else {
	resume = true
	console.log(
		'▶ State loaded. Looks like position is already opened.\n',
		'Bot will try to continue with the opened position, adjust price range and hedge if needed.\n',
	)
	console.log(
		`🚨🚨 If you wish to not resume from previous position, press \`Ctrl (Command) + C\` or \`pm2 stop surf-farming\` and delete the state file in: \n	${DB_DATA}.\n`,
		'Waiting 10 seconds...',
	)
	await setTimeout(10000)
}

const { whirlpoolData, update: updateWhirlpoolData } = await initWhirlpoolState(updateMethod)

if (!resume) {
	/* ---- SETUP ---- */
	await (async () => {
		// Initialize all ATAs, transfer tokens to surf wallet
		const initializeATAccountsIxs = await buildCreateATAccountsIxs(whirlpoolData.value.rewardInfos)
		const transferTokensIxs = buildDepositToSurfWalletIxs()
		const setupDriftIxs = await buildDriftInitializeUserIx()

		const instructions = [
			ComputeBudgetProgram.setComputeUnitLimit({ units: 150000 }),
			...initializeATAccountsIxs,
			...transferTokensIxs,
		]
		const signers = [userWallet]

		if (setupDriftIxs.length) {
			instructions.push(...setupDriftIxs)
			signers.push(surfWallet)
		}

		console.log('Creating Surf wallet, associated accounts, transferring tokens')
		await forceSendTx(() =>
			buildAndSignTxFromInstructions(
				{
					signers,
					instructions,
				},
				connection,
			),
		)
	})()

	/* ---- INIT ----
		- Open hedged position
			- deposit to whirlpool
			- hedge on drift
	*/
	await (async () => {
		await updateWhirlpoolData()
		console.log('Opening position')
		const { price, upperBoundaryPrice, lowerBoundaryPrice } = getPriceWithBoundariesFromSqrtPrice(
			whirlpoolData.value.sqrtPrice,
		)
		const { driftPosition, whirlpoolPosition } = await openHedgedPosition({
			usdcAmountRaw: USDC_POSITION_SIZE * 10 ** 6 - 500_000,
			whirlpoolData: whirlpoolData.value,
			upperBoundaryPrice,
			lowerBoundaryPrice,
		})

		const boundaries = getBoundariesFromTickIndexes({
			tickLowerIndex: whirlpoolPosition.tickLowerIndex,
			tickUpperIndex: whirlpoolPosition.tickUpperIndex,
		})
		const allowedPriceMove = getAllowedPriceMoveFromBoundaries(boundaries)

		await setState({
			priceMoveWithoutDriftAdjustment: allowedPriceMove,
			lastAdjustmentPrice: price,
			driftPosition,
			whirlpoolPosition,
		})

		console.log(
			'Hedged position opened\n',
			`Current pool price: ${price}\n`,
			`Upper boundary: ${upperBoundaryPrice.toFixed(6)}\n`,
			`Lower boundary: ${lowerBoundaryPrice.toFixed(6)}\n`,
		)
	})()
}

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

const UPDATE_TIMEOUT = 60_000

// TODO: collect fees and rewards
while (true) {
	await setTimeout(UPDATE_TIMEOUT)
	await updateWhirlpoolData()

	const {
		price: currentPoolPrice,
		upperBoundaryPrice,
		lowerBoundaryPrice,
	} = getPriceWithBoundariesFromSqrtPrice(whirlpoolData.value.sqrtPrice)
	console.log('Current pool price:', currentPoolPrice)

	// ---- PRICE RANGE ADJUSTING ----
	priceRangeAdjusting: {
		const positionInRange = isPriceInRange({
			positionTickLowerIndex: state.whirlpoolPosition.tickLowerIndex,
			positionTickUpperIndex: state.whirlpoolPosition.tickUpperIndex,
			currentPoolPrice,
		})

		if (positionInRange) {
			break priceRangeAdjusting
		}

		console.log('Adjusting position price range')
		const adjustedWhirlpoolPosition = await adjustPriceRange({
			whirlpoolPosition: state.whirlpoolPosition,
			currentPrice: currentPoolPrice,
			whirlpoolData: whirlpoolData.value,
		})
		console.log(
			'Adjusted whirlpool position\n',
			`Upper boundary: ${upperBoundaryPrice.toFixed(6)}\n`,
			`Lower boundary: ${lowerBoundaryPrice.toFixed(6)}\n`,
		)

		console.log('Adjusting drift position')
		const adjustedDriftPosition = await adjustDriftPosition({
			driftPosition: state.driftPosition,
			whirlpoolPositionData: adjustedWhirlpoolPosition,
		})
		console.log('New drift position borrowed amount: ', adjustedDriftPosition.borrowAmount)

		const boundaries = getBoundariesFromTickIndexes({
			tickLowerIndex: adjustedWhirlpoolPosition.tickLowerIndex,
			tickUpperIndex: adjustedWhirlpoolPosition.tickUpperIndex,
		})

		await setState({
			whirlpoolPosition: adjustedWhirlpoolPosition,
			driftPosition: adjustedDriftPosition,
			lastAdjustmentPrice: currentPoolPrice,
			priceMoveWithoutDriftAdjustment: getAllowedPriceMoveFromBoundaries(boundaries),
		})
		continue
	}

	// ---- HEDGED POSITION ADJUSTING ----
	if (
		state.lastAdjustmentPrice + state.priceMoveWithoutDriftAdjustment > currentPoolPrice &&
		state.lastAdjustmentPrice - state.priceMoveWithoutDriftAdjustment < currentPoolPrice
	) {
		continue
	}

	console.log('Adjusting drift position')
	const adjustedDriftPosition = await adjustDriftPosition({
		driftPosition: state.driftPosition,
		whirlpoolPositionData: state.whirlpoolPosition,
		whirlpoolSqrtPrice: whirlpoolData.value.sqrtPrice,
	})
	console.log('New drift position borrowed amount: ', adjustedDriftPosition.borrowAmount)

	await setState({
		driftPosition: adjustedDriftPosition,
		lastAdjustmentPrice: currentPoolPrice,
	})
}
