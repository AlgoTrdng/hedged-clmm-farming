import { ORCA_WHIRLPOOL_PROGRAM_ID, PDAUtil } from '@orca-so/whirlpools-sdk'
import { PublicKey } from '@solana/web3.js'
import { setTimeout } from 'node:timers/promises'

import { USDC_MINT, SOL_MINT, MIN_SOL_AMOUNT_RAW } from './constants.js'
import { getWhirlpoolData } from './orca/pool.js'
import { lowerBoundaryBps, tokenA, tokenB, upperBoundaryBps } from './global.js'

const wait = () => setTimeout(60_000)

// INIT
// Open position
