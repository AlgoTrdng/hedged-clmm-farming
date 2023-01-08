import { loadConfig, loadEnv, loadWallet } from './loaders.js'

const envConfig = loadEnv()
const config = await loadConfig()
const wallet = await loadWallet(envConfig.ANCHOR_WALLET)

export const WALLET_PRIVATE_KEY = wallet
export const { ANCHOR_PROVIDER_URL: RPC_URL, SURF_WALLET_CACHE, DB_DATA, ANALYTICS } = envConfig
export const {
	whirlpoolAddress: WHIRLPOOL_ADDRESS,
	upperBoundaryPct: UPPER_BOUNDARY_PCT,
	lowerBoundaryPct: LOWER_BOUNDARY_PCT,
	usdcPositionSize: USDC_POSITION_SIZE,
} = config
