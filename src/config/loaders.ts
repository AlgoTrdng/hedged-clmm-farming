import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { ZodFormattedError } from 'zod'

import { configSchema, envConfigSchema } from './schemas.js'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = __dirname.split('dist')[0]

const formatZodErrors = (error: ZodFormattedError<Record<string, string>, string>) => Object.entries(error)
.map(([name, value]) => {
	if (value && "_errors" in value)
		return `${name}: ${value._errors.join(", ")}\n`
})
.filter(Boolean)

export const loadEnv = () => {
	const envConfigRes = envConfigSchema.safeParse(process.env)
	if (!envConfigRes.success) {
		const errors = formatZodErrors(envConfigRes.error.format() as ZodFormattedError<Record<string, string>, string>)
		console.error('[ENV]: Invalid env variables:\n', ...errors)
		throw Error('Invalid env variables')
	}
	return envConfigRes.data
}

export const loadConfig = async () => {
	const configFile = await fs.readFile(path.join(rootDir, './config.json'), {
		encoding: 'utf-8',
	})
	const configRes = configSchema.safeParse(JSON.parse(configFile))
	if (!configRes.success) {
		const errors = formatZodErrors(configRes.error.format() as ZodFormattedError<Record<string, string>, string>)
		console.error('[CONFIG]: Invalid config:\n', ...errors)
		throw Error('Invalid config')
	}
	return configRes.data
}

export const loadWallet = async (walletFilePath: string) => {
	const walletFile = await fs.readFile(walletFilePath, { encoding: 'utf-8' })
	const walletPrivateKey = Uint8Array.from(JSON.parse(walletFile))
	return walletPrivateKey
}
