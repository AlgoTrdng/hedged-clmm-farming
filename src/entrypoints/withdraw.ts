import { buildAndSignTxFromInstructions } from 'solana-tx-utils'

import { closeHedgedPosition } from '../actions/closeHedgedPosition.js'
import { USDC_MINT } from '../constants.js'
import { connection, surfWallet, userWallet } from '../global.js'
import { buildWithdrawFromSurfWalletIxs } from '../services/wallet/transferTokens.js'
import { loadState, state } from '../state.js'
import { forceSendTx } from '../utils/forceSendTx.js'

await loadState()

if (Object.keys(state).length < 4) {
  console.error('Could not close position. Position is not opened or db-data has been modified.')
  throw Error('Invalid state')
}

const closeHedgedPositionTxMeta = await closeHedgedPosition()

const transferTokensIxs = buildWithdrawFromSurfWalletIxs({
  tokenA: closeHedgedPositionTxMeta.postBalances[0],
  tokenB: Number(closeHedgedPositionTxMeta.postTokenBalances!.find(({mint}) => mint === USDC_MINT.toString())!.uiTokenAmount.amount),
})
await forceSendTx(() => buildAndSignTxFromInstructions({
  signers: [surfWallet],
  instructions: transferTokensIxs,
}, connection))

console.log(
  '✅ Hedged position successfully closed\n',
  '- Whirlpool position closed\n',
  '- Loan on Drift protocol repaid and balances withdrawn\n',
  `- Tokens transferred to user wallet: ${userWallet.publicKey.toString()}\n`,
)
