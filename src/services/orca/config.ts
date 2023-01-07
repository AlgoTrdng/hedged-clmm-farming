import {
	WhirlpoolContext,
	ORCA_WHIRLPOOL_PROGRAM_ID,
	AccountFetcher,
} from '@orca-so/whirlpools-sdk'

import { connection, provider } from '../../global.js'

export const fetcher = new AccountFetcher(connection)

const ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID)
export const whirlpoolProgram = ctx.program
