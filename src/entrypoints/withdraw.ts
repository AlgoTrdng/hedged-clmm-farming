import fs from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'

import { closeHedgedPosition } from '../actions/closeHedgedPosition.js'
import { transferTokensAndCloseAccounts } from '../actions/transferTokensAndCloseAccounts.js'
import { surfWallet, tokenB, userWallet } from '../global.js'
import { fetchWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { loadState, state } from '../state.js'
import { SURF_WALLET_CACHE } from '../config/index.js'

const cliArgs = process.argv
const shouldDelete = cliArgs.includes('-d') || cliArgs.includes('--delete')

if (shouldDelete) {
	console.log(
		'🚨🚨 This action will delete surf wallet credentials. Make sure there are not any tokens unrelated to the orca whirlpools (rewards tokens...).\n',
		'Waiting 10 seconds.... If You do not want to continue, press `Ctrl (Command) + C`\n',
	)
	await setTimeout(10000)
}

await loadState()

if (Object.keys(state).length < 4) {
	console.error('Could not close position. Position is not opened or db-data has been modified.')
	throw Error('Invalid state')
}

const whirlpoolData = await fetchWhirlpoolData()

const closeHedgedPositionTxMeta = await closeHedgedPosition(whirlpoolData)

const postClosePositionTokenABalance = closeHedgedPositionTxMeta.postBalances[0]
const postClosePositionTokenBBalance = Number(
	closeHedgedPositionTxMeta.postTokenBalances!.find(
		({ mint, owner }) =>
			mint === tokenB.mint.toString() && owner === surfWallet.publicKey.toString(),
	)!.uiTokenAmount.amount,
)

await transferTokensAndCloseAccounts({
	balances: {
		tokenA: postClosePositionTokenABalance,
		tokenB: postClosePositionTokenBBalance,
	},
	shouldDelete,
	whirlpoolData,
})

const logs = [
	'✅ Hedged position successfully closed\n',
	'- Whirlpool position closed\n',
	'- Loan on Drift protocol repaid and balances withdrawn\n',
	`- Tokens transferred to user wallet: ${userWallet.publicKey.toString()}\n`,
]

if (shouldDelete) {
	logs.push('- Closed accounts\n', '- Deleted surf wallet credentials\n')
	await fs.rm(SURF_WALLET_CACHE)
}

console.log(...logs)
