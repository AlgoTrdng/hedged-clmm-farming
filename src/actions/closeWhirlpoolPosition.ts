import { CollectFeesParams, WhirlpoolData, WhirlpoolIx } from '@orca-so/whirlpools-sdk'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { buildAndSignTxFromInstructions, sendTransaction } from 'solana-tx-utils'
import { setTimeout } from 'node:timers/promises'

import { connection, ctx, fetcher, tokenA, tokenB, wallet } from '../global.js'
import { getTickArrays } from '../services/orca/helpers/getTickArrays.js'
import { buildCloseWhirlpoolPositionIx } from '../services/orca/instructions/closePosition.js'
import { buildCollectRewardsIxs } from '../services/orca/instructions/collectRewards.js'
import { buildDecreaseLiquidityIx } from '../services/orca/instructions/decreaseLiquidity.js'
import { getWhirlpoolData } from '../services/orca/getWhirlpoolData.js'
import { PositionMetadata } from '../services/orca/types.js'
import { loadALTAccount } from '../utils/loadALTAccount.js'
import { retryOnThrow } from '../utils/retryOnThrow.js'

type CloseHedgedPositionParams = {
	positionMetadata: PositionMetadata
	whirlpoolData: WhirlpoolData
}

export const closeHedgedPosition = async ({
	positionMetadata,
	whirlpoolData,
}: CloseHedgedPositionParams): Promise<void> => {
	const { tickLowerArrayAddress, tickUpperArrayAddress } = getTickArrays({
		tickLowerIndex: positionMetadata.tickLowerIndex,
		tickUpperIndex: positionMetadata.tickUpperIndex,
		tickSpacing: whirlpoolData.tickSpacing,
	})
	const { instructions: updateFeesAndRewardsIxs } = WhirlpoolIx.updateFeesAndRewardsIx(
		ctx.program,
		{
			whirlpool: positionMetadata.whirlpool,
			position: positionMetadata.PDAddress,
			tickArrayLower: tickLowerArrayAddress,
			tickArrayUpper: tickUpperArrayAddress,
		},
	)
	const createWrappedSolAccountIx = createAssociatedTokenAccountInstruction(
		wallet.publicKey,
		tokenA.ATAddress,
		wallet.publicKey,
		tokenA.mint,
	)
	const collectFeesIxAccounts: CollectFeesParams = {
		whirlpool: positionMetadata.whirlpool,
		positionAuthority: wallet.publicKey,
		position: positionMetadata.PDAddress,
		positionTokenAccount: positionMetadata.ATAddress,
		tokenOwnerAccountA: tokenA.ATAddress,
		tokenOwnerAccountB: tokenB.ATAddress,
		tokenVaultA: whirlpoolData.tokenVaultA,
		tokenVaultB: whirlpoolData.tokenVaultB,
	}
	const { instructions: collectFeesIx } = WhirlpoolIx.collectFeesIx(
		ctx.program,
		collectFeesIxAccounts,
	)
	const { setupATAsInstructions, collectRewardsIxs } = await buildCollectRewardsIxs({
		positionMetadata,
		whirlpoolData,
		tickLowerArrayAddress,
		tickUpperArrayAddress,
	})
	let decreaseLiquidityIx = await buildDecreaseLiquidityIx({
		accounts: collectFeesIxAccounts,
		position: positionMetadata,
		whirlpoolData,
		tickLowerArrayAddress,
		tickUpperArrayAddress,
	})
	const closePositionIx = buildCloseWhirlpoolPositionIx(positionMetadata)

	const ALTAccount = await loadALTAccount()
	const buildTx = () =>
		buildAndSignTxFromInstructions(
			{
				signers: [wallet],
				addressLookupTables: [ALTAccount],
				instructions: [
					...updateFeesAndRewardsIxs,
					createWrappedSolAccountIx,
					...collectFeesIx,
					...setupATAsInstructions,
					...collectRewardsIxs,
					decreaseLiquidityIx,
					...closePositionIx,
				],
			},
			connection,
		)
	let txData = await buildTx()

	while (true) {
		const res = await sendTransaction(
			{
				...txData,
				connection,
			},
			{ log: true },
		)
		switch (res.status) {
			case 'SUCCESS': {
				return
			}
			case 'BLOCK_HEIGHT_EXCEEDED': {
				const positionData = await retryOnThrow(() =>
					fetcher.getPosition(positionMetadata.PDAddress),
				)
				if (!positionData) {
					throw Error(`Position ${positionMetadata.PDAddress.toString()} is already closed`)
				}
				const _whirlpoolData = await getWhirlpoolData()
				return closeHedgedPosition({
					positionMetadata: {
						...positionData,
						PDAddress: positionMetadata.PDAddress,
						ATAddress: positionMetadata.ATAddress,
					},
					whirlpoolData: _whirlpoolData,
				})
			}
			case 'ERROR':
				{
					// Slippage exceeded
					if (res.error.error === 6018) {
						const _whirlpoolData = await getWhirlpoolData()
						decreaseLiquidityIx = await buildDecreaseLiquidityIx({
							accounts: collectFeesIxAccounts,
							position: positionMetadata,
							whirlpoolData: _whirlpoolData,
							tickLowerArrayAddress,
							tickUpperArrayAddress,
						})
						txData = await buildTx()
					}
				}
				await setTimeout(500)
		}
	}
}
