export type IDL = {
	version: '2.9.0-beta.0'
	name: 'drift'
	instructions: [
		{
			name: 'initializeUser'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'payer'
					isMut: true
					isSigner: true
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'subAccountId'
					type: 'u16'
				},
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'initializeUserStats'
			accounts: [
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'payer'
					isMut: true
					isSigner: true
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'deposit'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'userTokenAccount'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
				{
					name: 'reduceOnly'
					type: 'bool'
				},
			]
		},
		{
			name: 'withdraw'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'userTokenAccount'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
				{
					name: 'reduceOnly'
					type: 'bool'
				},
			]
		},
		{
			name: 'transferDeposit'
			accounts: [
				{
					name: 'fromUser'
					isMut: true
					isSigner: false
				},
				{
					name: 'toUser'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'placePerpOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
			]
		},
		{
			name: 'cancelOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'orderId'
					type: {
						option: 'u32'
					}
				},
			]
		},
		{
			name: 'cancelOrderByUserId'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'userOrderId'
					type: 'u8'
				},
			]
		},
		{
			name: 'cancelOrders'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'marketType'
					type: {
						option: {
							defined: 'MarketType'
						}
					}
				},
				{
					name: 'marketIndex'
					type: {
						option: 'u16'
					}
				},
				{
					name: 'direction'
					type: {
						option: {
							defined: 'PositionDirection'
						}
					}
				},
			]
		},
		{
			name: 'placeAndTakePerpOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
				{
					name: 'makerOrderId'
					type: {
						option: 'u32'
					}
				},
			]
		},
		{
			name: 'placeAndMakePerpOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'taker'
					isMut: true
					isSigner: false
				},
				{
					name: 'takerStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
				{
					name: 'takerOrderId'
					type: 'u32'
				},
			]
		},
		{
			name: 'placeSpotOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
			]
		},
		{
			name: 'placeAndTakeSpotOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
				{
					name: 'fulfillmentType'
					type: {
						option: {
							defined: 'SpotFulfillmentType'
						}
					}
				},
				{
					name: 'makerOrderId'
					type: {
						option: 'u32'
					}
				},
			]
		},
		{
			name: 'placeAndMakeSpotOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'taker'
					isMut: true
					isSigner: false
				},
				{
					name: 'takerStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'params'
					type: {
						defined: 'OrderParams'
					}
				},
				{
					name: 'takerOrderId'
					type: 'u32'
				},
				{
					name: 'fulfillmentType'
					type: {
						option: {
							defined: 'SpotFulfillmentType'
						}
					}
				},
			]
		},
		{
			name: 'addPerpLpShares'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'nShares'
					type: 'u64'
				},
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'removePerpLpShares'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'sharesToBurn'
					type: 'u64'
				},
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'removePerpLpSharesInExpiringMarket'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'sharesToBurn'
					type: 'u64'
				},
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'updateUserName'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'subAccountId'
					type: 'u16'
				},
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'updateUserCustomMarginRatio'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'subAccountId'
					type: 'u16'
				},
				{
					name: 'marginRatio'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateUserMarginTradingEnabled'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'subAccountId'
					type: 'u16'
				},
				{
					name: 'marginTradingEnabled'
					type: 'bool'
				},
			]
		},
		{
			name: 'updateUserDelegate'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'subAccountId'
					type: 'u16'
				},
				{
					name: 'delegate'
					type: 'publicKey'
				},
			]
		},
		{
			name: 'deleteUser'
			accounts: [
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: []
		},
		{
			name: 'fillPerpOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'filler'
					isMut: true
					isSigner: false
				},
				{
					name: 'fillerStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'orderId'
					type: {
						option: 'u32'
					}
				},
				{
					name: 'makerOrderId'
					type: {
						option: 'u32'
					}
				},
			]
		},
		{
			name: 'fillSpotOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'filler'
					isMut: true
					isSigner: false
				},
				{
					name: 'fillerStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'orderId'
					type: {
						option: 'u32'
					}
				},
				{
					name: 'fulfillmentType'
					type: {
						option: {
							defined: 'SpotFulfillmentType'
						}
					}
				},
				{
					name: 'makerOrderId'
					type: {
						option: 'u32'
					}
				},
			]
		},
		{
			name: 'triggerOrder'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'filler'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'orderId'
					type: 'u32'
				},
			]
		},
		{
			name: 'forceCancelOrders'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'filler'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'settlePnl'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarketVault'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'settleFundingPayment'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'settleLp'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'settleExpiredMarket'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'liquidatePerp'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'liquidatorMaxBaseAssetAmount'
					type: 'u64'
				},
				{
					name: 'limitPrice'
					type: {
						option: 'u64'
					}
				},
			]
		},
		{
			name: 'liquidateSpot'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'assetMarketIndex'
					type: 'u16'
				},
				{
					name: 'liabilityMarketIndex'
					type: 'u16'
				},
				{
					name: 'liquidatorMaxLiabilityTransfer'
					type: 'u128'
				},
				{
					name: 'limitPrice'
					type: {
						option: 'u64'
					}
				},
			]
		},
		{
			name: 'liquidateBorrowForPerpPnl'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'perpMarketIndex'
					type: 'u16'
				},
				{
					name: 'spotMarketIndex'
					type: 'u16'
				},
				{
					name: 'liquidatorMaxLiabilityTransfer'
					type: 'u128'
				},
				{
					name: 'limitPrice'
					type: {
						option: 'u64'
					}
				},
			]
		},
		{
			name: 'liquidatePerpPnlForDeposit'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'perpMarketIndex'
					type: 'u16'
				},
				{
					name: 'spotMarketIndex'
					type: 'u16'
				},
				{
					name: 'liquidatorMaxPnlTransfer'
					type: 'u128'
				},
				{
					name: 'limitPrice'
					type: {
						option: 'u64'
					}
				},
			]
		},
		{
			name: 'resolvePerpPnlDeficit'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'spotMarketIndex'
					type: 'u16'
				},
				{
					name: 'perpMarketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'resolvePerpBankruptcy'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'quoteSpotMarketIndex'
					type: 'u16'
				},
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'resolveSpotBankruptcy'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'liquidator'
					isMut: true
					isSigner: false
				},
				{
					name: 'liquidatorStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'user'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'settleRevenueToInsuranceFund'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'spotMarketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'updateFundingRate'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'updateSpotMarketCumulativeInterest'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'updateAmms'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'marketIndexes'
					type: {
						array: ['u16', 5]
					}
				},
			]
		},
		{
			name: 'updateSpotMarketExpiry'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'expiryTs'
					type: 'i64'
				},
			]
		},
		{
			name: 'updateUserQuoteAssetInsuranceStake'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'initializeInsuranceFundStake'
			accounts: [
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'payer'
					isMut: true
					isSigner: true
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'addInsuranceFundStake'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'userTokenAccount'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'requestRemoveInsuranceFundStake'
			accounts: [
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'cancelRequestRemoveInsuranceFundStake'
			accounts: [
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'removeInsuranceFundStake'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundStake'
					isMut: true
					isSigner: false
				},
				{
					name: 'userStats'
					isMut: true
					isSigner: false
				},
				{
					name: 'authority'
					isMut: false
					isSigner: true
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'userTokenAccount'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'initialize'
			accounts: [
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'quoteAssetMint'
					isMut: false
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'initializeSpotMarket'
			accounts: [
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'spotMarketMint'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'optimalUtilization'
					type: 'u32'
				},
				{
					name: 'optimalBorrowRate'
					type: 'u32'
				},
				{
					name: 'maxBorrowRate'
					type: 'u32'
				},
				{
					name: 'oracleSource'
					type: {
						defined: 'OracleSource'
					}
				},
				{
					name: 'initialAssetWeight'
					type: 'u32'
				},
				{
					name: 'maintenanceAssetWeight'
					type: 'u32'
				},
				{
					name: 'initialLiabilityWeight'
					type: 'u32'
				},
				{
					name: 'maintenanceLiabilityWeight'
					type: 'u32'
				},
				{
					name: 'imfFactor'
					type: 'u32'
				},
				{
					name: 'liquidatorFee'
					type: 'u32'
				},
				{
					name: 'activeStatus'
					type: 'bool'
				},
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'initializeSerumFulfillmentConfig'
			accounts: [
				{
					name: 'baseSpotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'quoteSpotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'serumProgram'
					isMut: false
					isSigner: false
				},
				{
					name: 'serumMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'serumOpenOrders'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'serumFulfillmentConfig'
					isMut: true
					isSigner: false
				},
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
			]
		},
		{
			name: 'updateSerumFulfillmentConfigStatus'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'serumFulfillmentConfig'
					isMut: true
					isSigner: false
				},
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
			]
			args: [
				{
					name: 'status'
					type: {
						defined: 'SpotFulfillmentConfigStatus'
					}
				},
			]
		},
		{
			name: 'updateSerumVault'
			accounts: [
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
				{
					name: 'srmVault'
					isMut: false
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'initializePerpMarket'
			accounts: [
				{
					name: 'admin'
					isMut: true
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'rent'
					isMut: false
					isSigner: false
				},
				{
					name: 'systemProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'ammBaseAssetReserve'
					type: 'u128'
				},
				{
					name: 'ammQuoteAssetReserve'
					type: 'u128'
				},
				{
					name: 'ammPeriodicity'
					type: 'i64'
				},
				{
					name: 'ammPegMultiplier'
					type: 'u128'
				},
				{
					name: 'oracleSource'
					type: {
						defined: 'OracleSource'
					}
				},
				{
					name: 'marginRatioInitial'
					type: 'u32'
				},
				{
					name: 'marginRatioMaintenance'
					type: 'u32'
				},
				{
					name: 'liquidatorFee'
					type: 'u32'
				},
				{
					name: 'activeStatus'
					type: 'bool'
				},
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'moveAmmPrice'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'baseAssetReserve'
					type: 'u128'
				},
				{
					name: 'quoteAssetReserve'
					type: 'u128'
				},
				{
					name: 'sqrtK'
					type: 'u128'
				},
			]
		},
		{
			name: 'updatePerpMarketExpiry'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'expiryTs'
					type: 'i64'
				},
			]
		},
		{
			name: 'settleExpiredMarketPoolsToRevenuePool'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: []
		},
		{
			name: 'depositIntoPerpMarketFeePool'
			accounts: [
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'sourceVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'quoteSpotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'spotMarketVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'repegAmmCurve'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'newPegCandidate'
					type: 'u128'
				},
			]
		},
		{
			name: 'updatePerpMarketAmmOracleTwap'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
			]
			args: []
		},
		{
			name: 'resetPerpMarketAmmOracleTwap'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
			]
			args: []
		},
		{
			name: 'updateK'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'sqrtK'
					type: 'u128'
				},
			]
		},
		{
			name: 'updatePerpMarketMarginRatio'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'marginRatioInitial'
					type: 'u32'
				},
				{
					name: 'marginRatioMaintenance'
					type: 'u32'
				},
			]
		},
		{
			name: 'updatePerpMarketMaxImbalances'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'unrealizedMaxImbalance'
					type: 'u64'
				},
				{
					name: 'maxRevenueWithdrawPerPeriod'
					type: 'u64'
				},
				{
					name: 'quoteMaxInsurance'
					type: 'u64'
				},
			]
		},
		{
			name: 'updatePerpMarketLiquidationFee'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'liquidatorFee'
					type: 'u32'
				},
				{
					name: 'ifLiquidationFee'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateInsuranceFundUnstakingPeriod'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'insuranceFundUnstakingPeriod'
					type: 'i64'
				},
			]
		},
		{
			name: 'updateSpotMarketLiquidationFee'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'liquidatorFee'
					type: 'u32'
				},
				{
					name: 'ifLiquidationFee'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateWithdrawGuardThreshold'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'withdrawGuardThreshold'
					type: 'u64'
				},
			]
		},
		{
			name: 'updateSpotMarketIfFactor'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'spotMarketIndex'
					type: 'u16'
				},
				{
					name: 'userIfFactor'
					type: 'u32'
				},
				{
					name: 'totalIfFactor'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateSpotMarketRevenueSettlePeriod'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'revenueSettlePeriod'
					type: 'i64'
				},
			]
		},
		{
			name: 'updateSpotMarketStatus'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'status'
					type: {
						defined: 'MarketStatus'
					}
				},
			]
		},
		{
			name: 'updateSpotMarketAssetTier'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'assetTier'
					type: {
						defined: 'AssetTier'
					}
				},
			]
		},
		{
			name: 'updateSpotMarketMarginWeights'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'initialAssetWeight'
					type: 'u32'
				},
				{
					name: 'maintenanceAssetWeight'
					type: 'u32'
				},
				{
					name: 'initialLiabilityWeight'
					type: 'u32'
				},
				{
					name: 'maintenanceLiabilityWeight'
					type: 'u32'
				},
				{
					name: 'imfFactor'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateSpotMarketBorrowRate'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'optimalUtilization'
					type: 'u32'
				},
				{
					name: 'optimalBorrowRate'
					type: 'u32'
				},
				{
					name: 'maxBorrowRate'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateSpotMarketMaxTokenDeposits'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'maxTokenDeposits'
					type: 'u64'
				},
			]
		},
		{
			name: 'updateSpotMarketOracle'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'oracle'
					type: 'publicKey'
				},
				{
					name: 'oracleSource'
					type: {
						defined: 'OracleSource'
					}
				},
			]
		},
		{
			name: 'updateSpotMarketStepSizeAndTickSize'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'stepSize'
					type: 'u64'
				},
				{
					name: 'tickSize'
					type: 'u64'
				},
			]
		},
		{
			name: 'updateSpotMarketMinOrderSize'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'orderSize'
					type: 'u64'
				},
			]
		},
		{
			name: 'updateSpotMarketOrdersEnabled'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'ordersEnabled'
					type: 'bool'
				},
			]
		},
		{
			name: 'updateSpotMarketName'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'updatePerpMarketStatus'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'status'
					type: {
						defined: 'MarketStatus'
					}
				},
			]
		},
		{
			name: 'updatePerpMarketContractTier'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'contractTier'
					type: {
						defined: 'ContractTier'
					}
				},
			]
		},
		{
			name: 'updatePerpMarketImfFactor'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'imfFactor'
					type: 'u32'
				},
				{
					name: 'unrealizedPnlImfFactor'
					type: 'u32'
				},
			]
		},
		{
			name: 'updatePerpMarketUnrealizedAssetWeight'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'unrealizedInitialAssetWeight'
					type: 'u32'
				},
				{
					name: 'unrealizedMaintenanceAssetWeight'
					type: 'u32'
				},
			]
		},
		{
			name: 'updatePerpMarketConcentrationCoef'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'concentrationScale'
					type: 'u128'
				},
			]
		},
		{
			name: 'updatePerpMarketCurveUpdateIntensity'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'curveUpdateIntensity'
					type: 'u8'
				},
			]
		},
		{
			name: 'updateLpCooldownTime'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'lpCooldownTime'
					type: 'u64'
				},
			]
		},
		{
			name: 'updatePerpFeeStructure'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'feeStructure'
					type: {
						defined: 'FeeStructure'
					}
				},
			]
		},
		{
			name: 'updateSpotFeeStructure'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'feeStructure'
					type: {
						defined: 'FeeStructure'
					}
				},
			]
		},
		{
			name: 'updateInitialPctToLiquidate'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'initialPctToLiquidate'
					type: 'u16'
				},
			]
		},
		{
			name: 'updateLiquidationDuration'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'liquidationDuration'
					type: 'u8'
				},
			]
		},
		{
			name: 'updateOracleGuardRails'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'oracleGuardRails'
					type: {
						defined: 'OracleGuardRails'
					}
				},
			]
		},
		{
			name: 'updateStateSettlementDuration'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'settlementDuration'
					type: 'u16'
				},
			]
		},
		{
			name: 'updatePerpMarketOracle'
			accounts: [
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
				{
					name: 'oracle'
					isMut: false
					isSigner: false
				},
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
			]
			args: [
				{
					name: 'oracle'
					type: 'publicKey'
				},
				{
					name: 'oracleSource'
					type: {
						defined: 'OracleSource'
					}
				},
			]
		},
		{
			name: 'updatePerpMarketBaseSpread'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'baseSpread'
					type: 'u32'
				},
			]
		},
		{
			name: 'updateAmmJitIntensity'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'ammJitIntensity'
					type: 'u8'
				},
			]
		},
		{
			name: 'updatePerpMarketMaxSpread'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'maxSpread'
					type: 'u32'
				},
			]
		},
		{
			name: 'updatePerpMarketStepSizeAndTickSize'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'stepSize'
					type: 'u64'
				},
				{
					name: 'tickSize'
					type: 'u64'
				},
			]
		},
		{
			name: 'updatePerpMarketName'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
				},
			]
		},
		{
			name: 'updatePerpMarketMinOrderSize'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'orderSize'
					type: 'u64'
				},
			]
		},
		{
			name: 'updatePerpMarketMaxSlippageRatio'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'maxSlippageRatio'
					type: 'u16'
				},
			]
		},
		{
			name: 'updatePerpMarketMaxFillReserveFraction'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'maxFillReserveFraction'
					type: 'u16'
				},
			]
		},
		{
			name: 'updatePerpMarketMaxOpenInterest'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'perpMarket'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'maxOpenInterest'
					type: 'u128'
				},
			]
		},
		{
			name: 'updateAdmin'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'admin'
					type: 'publicKey'
				},
			]
		},
		{
			name: 'updateWhitelistMint'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'whitelistMint'
					type: 'publicKey'
				},
			]
		},
		{
			name: 'updateDiscountMint'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'discountMint'
					type: 'publicKey'
				},
			]
		},
		{
			name: 'updateExchangeStatus'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'exchangeStatus'
					type: {
						defined: 'ExchangeStatus'
					}
				},
			]
		},
		{
			name: 'updatePerpAuctionDuration'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'minPerpAuctionDuration'
					type: 'u8'
				},
			]
		},
		{
			name: 'updateSpotAuctionDuration'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: true
					isSigner: false
				},
			]
			args: [
				{
					name: 'defaultSpotAuctionDuration'
					type: 'u8'
				},
			]
		},
		{
			name: 'adminRemoveInsuranceFundStake'
			accounts: [
				{
					name: 'admin'
					isMut: false
					isSigner: true
				},
				{
					name: 'state'
					isMut: false
					isSigner: false
				},
				{
					name: 'spotMarket'
					isMut: false
					isSigner: false
				},
				{
					name: 'insuranceFundVault'
					isMut: true
					isSigner: false
				},
				{
					name: 'driftSigner'
					isMut: false
					isSigner: false
				},
				{
					name: 'adminTokenAccount'
					isMut: true
					isSigner: false
				},
				{
					name: 'tokenProgram'
					isMut: false
					isSigner: false
				},
			]
			args: [
				{
					name: 'marketIndex'
					type: 'u16'
				},
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
	]
	accounts: [
		{
			name: 'InsuranceFundStake'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'authority'
						type: 'publicKey'
					},
					{
						name: 'ifShares'
						type: 'u128'
					},
					{
						name: 'lastWithdrawRequestShares'
						type: 'u128'
					},
					{
						name: 'ifBase'
						type: 'u128'
					},
					{
						name: 'lastValidTs'
						type: 'i64'
					},
					{
						name: 'lastWithdrawRequestValue'
						type: 'u64'
					},
					{
						name: 'lastWithdrawRequestTs'
						type: 'i64'
					},
					{
						name: 'costBasis'
						type: 'i64'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 14]
						}
					},
				]
			}
		},
		{
			name: 'PerpMarket'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'pubkey'
						type: 'publicKey'
					},
					{
						name: 'amm'
						type: {
							defined: 'AMM'
						}
					},
					{
						name: 'pnlPool'
						type: {
							defined: 'PoolBalance'
						}
					},
					{
						name: 'name'
						type: {
							array: ['u8', 32]
						}
					},
					{
						name: 'insuranceClaim'
						type: {
							defined: 'InsuranceClaim'
						}
					},
					{
						name: 'unrealizedPnlMaxImbalance'
						type: 'u64'
					},
					{
						name: 'expiryTs'
						type: 'i64'
					},
					{
						name: 'expiryPrice'
						type: 'i64'
					},
					{
						name: 'nextFillRecordId'
						type: 'u64'
					},
					{
						name: 'nextFundingRateRecordId'
						type: 'u64'
					},
					{
						name: 'nextCurveRecordId'
						type: 'u64'
					},
					{
						name: 'imfFactor'
						type: 'u32'
					},
					{
						name: 'unrealizedPnlImfFactor'
						type: 'u32'
					},
					{
						name: 'liquidatorFee'
						type: 'u32'
					},
					{
						name: 'ifLiquidationFee'
						type: 'u32'
					},
					{
						name: 'marginRatioInitial'
						type: 'u32'
					},
					{
						name: 'marginRatioMaintenance'
						type: 'u32'
					},
					{
						name: 'unrealizedPnlInitialAssetWeight'
						type: 'u32'
					},
					{
						name: 'unrealizedPnlMaintenanceAssetWeight'
						type: 'u32'
					},
					{
						name: 'numberOfUsersWithBase'
						type: 'u32'
					},
					{
						name: 'numberOfUsers'
						type: 'u32'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'status'
						type: {
							defined: 'MarketStatus'
						}
					},
					{
						name: 'contractType'
						type: {
							defined: 'ContractType'
						}
					},
					{
						name: 'contractTier'
						type: {
							defined: 'ContractTier'
						}
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 51]
						}
					},
				]
			}
		},
		{
			name: 'SpotMarket'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'pubkey'
						type: 'publicKey'
					},
					{
						name: 'oracle'
						type: 'publicKey'
					},
					{
						name: 'mint'
						type: 'publicKey'
					},
					{
						name: 'vault'
						type: 'publicKey'
					},
					{
						name: 'name'
						type: {
							array: ['u8', 32]
						}
					},
					{
						name: 'historicalOracleData'
						type: {
							defined: 'HistoricalOracleData'
						}
					},
					{
						name: 'historicalIndexData'
						type: {
							defined: 'HistoricalIndexData'
						}
					},
					{
						name: 'revenuePool'
						type: {
							defined: 'PoolBalance'
						}
					},
					{
						name: 'spotFeePool'
						type: {
							defined: 'PoolBalance'
						}
					},
					{
						name: 'insuranceFund'
						type: {
							defined: 'InsuranceFund'
						}
					},
					{
						name: 'totalSpotFee'
						type: 'u128'
					},
					{
						name: 'depositBalance'
						type: 'u128'
					},
					{
						name: 'borrowBalance'
						type: 'u128'
					},
					{
						name: 'cumulativeDepositInterest'
						type: 'u128'
					},
					{
						name: 'cumulativeBorrowInterest'
						type: 'u128'
					},
					{
						name: 'totalSocialLoss'
						type: 'u128'
					},
					{
						name: 'totalQuoteSocialLoss'
						type: 'u128'
					},
					{
						name: 'withdrawGuardThreshold'
						type: 'u64'
					},
					{
						name: 'maxTokenDeposits'
						type: 'u64'
					},
					{
						name: 'depositTokenTwap'
						type: 'u64'
					},
					{
						name: 'borrowTokenTwap'
						type: 'u64'
					},
					{
						name: 'utilizationTwap'
						type: 'u64'
					},
					{
						name: 'lastInterestTs'
						type: 'u64'
					},
					{
						name: 'lastTwapTs'
						type: 'u64'
					},
					{
						name: 'expiryTs'
						type: 'i64'
					},
					{
						name: 'orderStepSize'
						type: 'u64'
					},
					{
						name: 'orderTickSize'
						type: 'u64'
					},
					{
						name: 'minOrderSize'
						type: 'u64'
					},
					{
						name: 'maxPositionSize'
						type: 'u64'
					},
					{
						name: 'nextFillRecordId'
						type: 'u64'
					},
					{
						name: 'nextDepositRecordId'
						type: 'u64'
					},
					{
						name: 'initialAssetWeight'
						type: 'u32'
					},
					{
						name: 'maintenanceAssetWeight'
						type: 'u32'
					},
					{
						name: 'initialLiabilityWeight'
						type: 'u32'
					},
					{
						name: 'maintenanceLiabilityWeight'
						type: 'u32'
					},
					{
						name: 'imfFactor'
						type: 'u32'
					},
					{
						name: 'liquidatorFee'
						type: 'u32'
					},
					{
						name: 'ifLiquidationFee'
						type: 'u32'
					},
					{
						name: 'optimalUtilization'
						type: 'u32'
					},
					{
						name: 'optimalBorrowRate'
						type: 'u32'
					},
					{
						name: 'maxBorrowRate'
						type: 'u32'
					},
					{
						name: 'decimals'
						type: 'u32'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'ordersEnabled'
						type: 'bool'
					},
					{
						name: 'oracleSource'
						type: {
							defined: 'OracleSource'
						}
					},
					{
						name: 'status'
						type: {
							defined: 'MarketStatus'
						}
					},
					{
						name: 'assetTier'
						type: {
							defined: 'AssetTier'
						}
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 86]
						}
					},
				]
			}
		},
		{
			name: 'SerumV3FulfillmentConfig'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'pubkey'
						type: 'publicKey'
					},
					{
						name: 'serumProgramId'
						type: 'publicKey'
					},
					{
						name: 'serumMarket'
						type: 'publicKey'
					},
					{
						name: 'serumRequestQueue'
						type: 'publicKey'
					},
					{
						name: 'serumEventQueue'
						type: 'publicKey'
					},
					{
						name: 'serumBids'
						type: 'publicKey'
					},
					{
						name: 'serumAsks'
						type: 'publicKey'
					},
					{
						name: 'serumBaseVault'
						type: 'publicKey'
					},
					{
						name: 'serumQuoteVault'
						type: 'publicKey'
					},
					{
						name: 'serumOpenOrders'
						type: 'publicKey'
					},
					{
						name: 'serumSignerNonce'
						type: 'u64'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'fulfillmentType'
						type: {
							defined: 'SpotFulfillmentType'
						}
					},
					{
						name: 'status'
						type: {
							defined: 'SpotFulfillmentConfigStatus'
						}
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 4]
						}
					},
				]
			}
		},
		{
			name: 'State'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'admin'
						type: 'publicKey'
					},
					{
						name: 'whitelistMint'
						type: 'publicKey'
					},
					{
						name: 'discountMint'
						type: 'publicKey'
					},
					{
						name: 'signer'
						type: 'publicKey'
					},
					{
						name: 'srmVault'
						type: 'publicKey'
					},
					{
						name: 'perpFeeStructure'
						type: {
							defined: 'FeeStructure'
						}
					},
					{
						name: 'spotFeeStructure'
						type: {
							defined: 'FeeStructure'
						}
					},
					{
						name: 'oracleGuardRails'
						type: {
							defined: 'OracleGuardRails'
						}
					},
					{
						name: 'numberOfAuthorities'
						type: 'u64'
					},
					{
						name: 'numberOfSubAccounts'
						type: 'u64'
					},
					{
						name: 'lpCooldownTime'
						type: 'u64'
					},
					{
						name: 'liquidationMarginBufferRatio'
						type: 'u32'
					},
					{
						name: 'settlementDuration'
						type: 'u16'
					},
					{
						name: 'numberOfMarkets'
						type: 'u16'
					},
					{
						name: 'numberOfSpotMarkets'
						type: 'u16'
					},
					{
						name: 'signerNonce'
						type: 'u8'
					},
					{
						name: 'minPerpAuctionDuration'
						type: 'u8'
					},
					{
						name: 'defaultMarketOrderTimeInForce'
						type: 'u8'
					},
					{
						name: 'defaultSpotAuctionDuration'
						type: 'u8'
					},
					{
						name: 'exchangeStatus'
						type: {
							defined: 'ExchangeStatus'
						}
					},
					{
						name: 'liquidationDuration'
						type: 'u8'
					},
					{
						name: 'initialPctToLiquidate'
						type: 'u16'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 14]
						}
					},
				]
			}
		},
		{
			name: 'User'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'authority'
						type: 'publicKey'
					},
					{
						name: 'delegate'
						type: 'publicKey'
					},
					{
						name: 'name'
						type: {
							array: ['u8', 32]
						}
					},
					{
						name: 'spotPositions'
						type: {
							array: [
								{
									defined: 'SpotPosition'
								},
								8,
							]
						}
					},
					{
						name: 'perpPositions'
						type: {
							array: [
								{
									defined: 'PerpPosition'
								},
								8,
							]
						}
					},
					{
						name: 'orders'
						type: {
							array: [
								{
									defined: 'Order'
								},
								32,
							]
						}
					},
					{
						name: 'lastAddPerpLpSharesTs'
						type: 'i64'
					},
					{
						name: 'totalDeposits'
						type: 'u64'
					},
					{
						name: 'totalWithdraws'
						type: 'u64'
					},
					{
						name: 'totalSocialLoss'
						type: 'u64'
					},
					{
						name: 'settledPerpPnl'
						type: 'i64'
					},
					{
						name: 'cumulativeSpotFees'
						type: 'i64'
					},
					{
						name: 'cumulativePerpFunding'
						type: 'i64'
					},
					{
						name: 'liquidationMarginFreed'
						type: 'u64'
					},
					{
						name: 'liquidationStartSlot'
						type: 'u64'
					},
					{
						name: 'nextOrderId'
						type: 'u32'
					},
					{
						name: 'maxMarginRatio'
						type: 'u32'
					},
					{
						name: 'nextLiquidationId'
						type: 'u16'
					},
					{
						name: 'subAccountId'
						type: 'u16'
					},
					{
						name: 'status'
						type: {
							defined: 'UserStatus'
						}
					},
					{
						name: 'isMarginTradingEnabled'
						type: 'bool'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 26]
						}
					},
				]
			}
		},
		{
			name: 'UserStats'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'authority'
						type: 'publicKey'
					},
					{
						name: 'referrer'
						type: 'publicKey'
					},
					{
						name: 'fees'
						type: {
							defined: 'UserFees'
						}
					},
					{
						name: 'nextEpochTs'
						type: 'i64'
					},
					{
						name: 'makerVolume30d'
						type: 'u64'
					},
					{
						name: 'takerVolume30d'
						type: 'u64'
					},
					{
						name: 'fillerVolume30d'
						type: 'u64'
					},
					{
						name: 'lastMakerVolume30dTs'
						type: 'i64'
					},
					{
						name: 'lastTakerVolume30dTs'
						type: 'i64'
					},
					{
						name: 'lastFillerVolume30dTs'
						type: 'i64'
					},
					{
						name: 'ifStakedQuoteAssetAmount'
						type: 'u64'
					},
					{
						name: 'numberOfSubAccounts'
						type: 'u16'
					},
					{
						name: 'numberOfSubAccountsCreated'
						type: 'u16'
					},
					{
						name: 'isReferrer'
						type: 'bool'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 51]
						}
					},
				]
			}
		},
	]
	types: [
		{
			name: 'OrderParams'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'orderType'
						type: {
							defined: 'OrderType'
						}
					},
					{
						name: 'marketType'
						type: {
							defined: 'MarketType'
						}
					},
					{
						name: 'direction'
						type: {
							defined: 'PositionDirection'
						}
					},
					{
						name: 'userOrderId'
						type: 'u8'
					},
					{
						name: 'baseAssetAmount'
						type: 'u64'
					},
					{
						name: 'price'
						type: 'u64'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'reduceOnly'
						type: 'bool'
					},
					{
						name: 'postOnly'
						type: 'bool'
					},
					{
						name: 'immediateOrCancel'
						type: 'bool'
					},
					{
						name: 'maxTs'
						type: {
							option: 'i64'
						}
					},
					{
						name: 'triggerPrice'
						type: {
							option: 'u64'
						}
					},
					{
						name: 'triggerCondition'
						type: {
							defined: 'OrderTriggerCondition'
						}
					},
					{
						name: 'oraclePriceOffset'
						type: {
							option: 'i32'
						}
					},
					{
						name: 'auctionDuration'
						type: {
							option: 'u8'
						}
					},
					{
						name: 'auctionStartPrice'
						type: {
							option: 'i64'
						}
					},
					{
						name: 'auctionEndPrice'
						type: {
							option: 'i64'
						}
					},
				]
			}
		},
		{
			name: 'LiquidatePerpRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'oraclePrice'
						type: 'i64'
					},
					{
						name: 'baseAssetAmount'
						type: 'i64'
					},
					{
						name: 'quoteAssetAmount'
						type: 'i64'
					},
					{
						name: 'lpShares'
						type: 'u64'
					},
					{
						name: 'fillRecordId'
						type: 'u64'
					},
					{
						name: 'userOrderId'
						type: 'u32'
					},
					{
						name: 'liquidatorOrderId'
						type: 'u32'
					},
					{
						name: 'liquidatorFee'
						type: 'u64'
					},
					{
						name: 'ifFee'
						type: 'u64'
					},
				]
			}
		},
		{
			name: 'LiquidateSpotRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'assetMarketIndex'
						type: 'u16'
					},
					{
						name: 'assetPrice'
						type: 'i64'
					},
					{
						name: 'assetTransfer'
						type: 'u128'
					},
					{
						name: 'liabilityMarketIndex'
						type: 'u16'
					},
					{
						name: 'liabilityPrice'
						type: 'i64'
					},
					{
						name: 'liabilityTransfer'
						type: 'u128'
					},
					{
						name: 'ifFee'
						type: 'u64'
					},
				]
			}
		},
		{
			name: 'LiquidateBorrowForPerpPnlRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'perpMarketIndex'
						type: 'u16'
					},
					{
						name: 'marketOraclePrice'
						type: 'i64'
					},
					{
						name: 'pnlTransfer'
						type: 'u128'
					},
					{
						name: 'liabilityMarketIndex'
						type: 'u16'
					},
					{
						name: 'liabilityPrice'
						type: 'i64'
					},
					{
						name: 'liabilityTransfer'
						type: 'u128'
					},
				]
			}
		},
		{
			name: 'LiquidatePerpPnlForDepositRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'perpMarketIndex'
						type: 'u16'
					},
					{
						name: 'marketOraclePrice'
						type: 'i64'
					},
					{
						name: 'pnlTransfer'
						type: 'u128'
					},
					{
						name: 'assetMarketIndex'
						type: 'u16'
					},
					{
						name: 'assetPrice'
						type: 'i64'
					},
					{
						name: 'assetTransfer'
						type: 'u128'
					},
				]
			}
		},
		{
			name: 'PerpBankruptcyRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'pnl'
						type: 'i128'
					},
					{
						name: 'ifPayment'
						type: 'u128'
					},
					{
						name: 'clawbackUser'
						type: {
							option: 'publicKey'
						}
					},
					{
						name: 'clawbackUserPayment'
						type: {
							option: 'u128'
						}
					},
					{
						name: 'cumulativeFundingRateDelta'
						type: 'i128'
					},
				]
			}
		},
		{
			name: 'SpotBankruptcyRecord'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'borrowAmount'
						type: 'u128'
					},
					{
						name: 'ifPayment'
						type: 'u128'
					},
					{
						name: 'cumulativeDepositInterestDelta'
						type: 'u128'
					},
				]
			}
		},
		{
			name: 'HistoricalOracleData'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'lastOraclePrice'
						type: 'i64'
					},
					{
						name: 'lastOracleConf'
						type: 'u64'
					},
					{
						name: 'lastOracleDelay'
						type: 'i64'
					},
					{
						name: 'lastOraclePriceTwap'
						type: 'i64'
					},
					{
						name: 'lastOraclePriceTwap5min'
						type: 'i64'
					},
					{
						name: 'lastOraclePriceTwapTs'
						type: 'i64'
					},
				]
			}
		},
		{
			name: 'HistoricalIndexData'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'lastIndexBidPrice'
						type: 'u64'
					},
					{
						name: 'lastIndexAskPrice'
						type: 'u64'
					},
					{
						name: 'lastIndexPriceTwap'
						type: 'u64'
					},
					{
						name: 'lastIndexPriceTwap5min'
						type: 'u64'
					},
					{
						name: 'lastIndexPriceTwapTs'
						type: 'i64'
					},
				]
			}
		},
		{
			name: 'InsuranceClaim'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'revenueWithdrawSinceLastSettle'
						type: 'u64'
					},
					{
						name: 'maxRevenueWithdrawPerPeriod'
						type: 'u64'
					},
					{
						name: 'quoteMaxInsurance'
						type: 'u64'
					},
					{
						name: 'quoteSettledInsurance'
						type: 'u64'
					},
					{
						name: 'lastRevenueWithdrawTs'
						type: 'i64'
					},
				]
			}
		},
		{
			name: 'PoolBalance'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'scaledBalance'
						type: 'u128'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 6]
						}
					},
				]
			}
		},
		{
			name: 'AMM'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'oracle'
						type: 'publicKey'
					},
					{
						name: 'historicalOracleData'
						type: {
							defined: 'HistoricalOracleData'
						}
					},
					{
						name: 'baseAssetAmountPerLp'
						type: 'i128'
					},
					{
						name: 'quoteAssetAmountPerLp'
						type: 'i128'
					},
					{
						name: 'feePool'
						type: {
							defined: 'PoolBalance'
						}
					},
					{
						name: 'baseAssetReserve'
						type: 'u128'
					},
					{
						name: 'quoteAssetReserve'
						type: 'u128'
					},
					{
						name: 'concentrationCoef'
						type: 'u128'
					},
					{
						name: 'minBaseAssetReserve'
						type: 'u128'
					},
					{
						name: 'maxBaseAssetReserve'
						type: 'u128'
					},
					{
						name: 'sqrtK'
						type: 'u128'
					},
					{
						name: 'pegMultiplier'
						type: 'u128'
					},
					{
						name: 'terminalQuoteAssetReserve'
						type: 'u128'
					},
					{
						name: 'baseAssetAmountLong'
						type: 'i128'
					},
					{
						name: 'baseAssetAmountShort'
						type: 'i128'
					},
					{
						name: 'baseAssetAmountWithAmm'
						type: 'i128'
					},
					{
						name: 'baseAssetAmountWithUnsettledLp'
						type: 'i128'
					},
					{
						name: 'maxOpenInterest'
						type: 'u128'
					},
					{
						name: 'quoteAssetAmount'
						type: 'i128'
					},
					{
						name: 'quoteEntryAmountLong'
						type: 'i128'
					},
					{
						name: 'quoteEntryAmountShort'
						type: 'i128'
					},
					{
						name: 'quoteBreakEvenAmountLong'
						type: 'i128'
					},
					{
						name: 'quoteBreakEvenAmountShort'
						type: 'i128'
					},
					{
						name: 'userLpShares'
						type: 'u128'
					},
					{
						name: 'lastFundingRate'
						type: 'i64'
					},
					{
						name: 'lastFundingRateLong'
						type: 'i64'
					},
					{
						name: 'lastFundingRateShort'
						type: 'i64'
					},
					{
						name: 'last24hAvgFundingRate'
						type: 'i64'
					},
					{
						name: 'totalFee'
						type: 'i128'
					},
					{
						name: 'totalMmFee'
						type: 'i128'
					},
					{
						name: 'totalExchangeFee'
						type: 'u128'
					},
					{
						name: 'totalFeeMinusDistributions'
						type: 'i128'
					},
					{
						name: 'totalFeeWithdrawn'
						type: 'u128'
					},
					{
						name: 'totalLiquidationFee'
						type: 'u128'
					},
					{
						name: 'cumulativeFundingRateLong'
						type: 'i128'
					},
					{
						name: 'cumulativeFundingRateShort'
						type: 'i128'
					},
					{
						name: 'totalSocialLoss'
						type: 'u128'
					},
					{
						name: 'askBaseAssetReserve'
						type: 'u128'
					},
					{
						name: 'askQuoteAssetReserve'
						type: 'u128'
					},
					{
						name: 'bidBaseAssetReserve'
						type: 'u128'
					},
					{
						name: 'bidQuoteAssetReserve'
						type: 'u128'
					},
					{
						name: 'lastOracleNormalisedPrice'
						type: 'i64'
					},
					{
						name: 'lastOracleReservePriceSpreadPct'
						type: 'i64'
					},
					{
						name: 'lastBidPriceTwap'
						type: 'u64'
					},
					{
						name: 'lastAskPriceTwap'
						type: 'u64'
					},
					{
						name: 'lastMarkPriceTwap'
						type: 'u64'
					},
					{
						name: 'lastMarkPriceTwap5min'
						type: 'u64'
					},
					{
						name: 'lastUpdateSlot'
						type: 'u64'
					},
					{
						name: 'lastOracleConfPct'
						type: 'u64'
					},
					{
						name: 'netRevenueSinceLastFunding'
						type: 'i64'
					},
					{
						name: 'lastFundingRateTs'
						type: 'i64'
					},
					{
						name: 'fundingPeriod'
						type: 'i64'
					},
					{
						name: 'orderStepSize'
						type: 'u64'
					},
					{
						name: 'orderTickSize'
						type: 'u64'
					},
					{
						name: 'minOrderSize'
						type: 'u64'
					},
					{
						name: 'maxPositionSize'
						type: 'u64'
					},
					{
						name: 'volume24h'
						type: 'u64'
					},
					{
						name: 'longIntensityVolume'
						type: 'u64'
					},
					{
						name: 'shortIntensityVolume'
						type: 'u64'
					},
					{
						name: 'lastTradeTs'
						type: 'i64'
					},
					{
						name: 'markStd'
						type: 'u64'
					},
					{
						name: 'oracleStd'
						type: 'u64'
					},
					{
						name: 'lastMarkPriceTwapTs'
						type: 'i64'
					},
					{
						name: 'baseSpread'
						type: 'u32'
					},
					{
						name: 'maxSpread'
						type: 'u32'
					},
					{
						name: 'longSpread'
						type: 'u32'
					},
					{
						name: 'shortSpread'
						type: 'u32'
					},
					{
						name: 'longIntensityCount'
						type: 'u32'
					},
					{
						name: 'shortIntensityCount'
						type: 'u32'
					},
					{
						name: 'maxFillReserveFraction'
						type: 'u16'
					},
					{
						name: 'maxSlippageRatio'
						type: 'u16'
					},
					{
						name: 'curveUpdateIntensity'
						type: 'u8'
					},
					{
						name: 'ammJitIntensity'
						type: 'u8'
					},
					{
						name: 'oracleSource'
						type: {
							defined: 'OracleSource'
						}
					},
					{
						name: 'lastOracleValid'
						type: 'bool'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 48]
						}
					},
				]
			}
		},
		{
			name: 'InsuranceFund'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'vault'
						type: 'publicKey'
					},
					{
						name: 'totalShares'
						type: 'u128'
					},
					{
						name: 'userShares'
						type: 'u128'
					},
					{
						name: 'sharesBase'
						type: 'u128'
					},
					{
						name: 'unstakingPeriod'
						type: 'i64'
					},
					{
						name: 'lastRevenueSettleTs'
						type: 'i64'
					},
					{
						name: 'revenueSettlePeriod'
						type: 'i64'
					},
					{
						name: 'totalFactor'
						type: 'u32'
					},
					{
						name: 'userFactor'
						type: 'u32'
					},
				]
			}
		},
		{
			name: 'OracleGuardRails'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'priceDivergence'
						type: {
							defined: 'PriceDivergenceGuardRails'
						}
					},
					{
						name: 'validity'
						type: {
							defined: 'ValidityGuardRails'
						}
					},
				]
			}
		},
		{
			name: 'PriceDivergenceGuardRails'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'markOracleDivergenceNumerator'
						type: 'u64'
					},
					{
						name: 'markOracleDivergenceDenominator'
						type: 'u64'
					},
				]
			}
		},
		{
			name: 'ValidityGuardRails'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'slotsBeforeStaleForAmm'
						type: 'i64'
					},
					{
						name: 'slotsBeforeStaleForMargin'
						type: 'i64'
					},
					{
						name: 'confidenceIntervalMaxSize'
						type: 'u64'
					},
					{
						name: 'tooVolatileRatio'
						type: 'i64'
					},
				]
			}
		},
		{
			name: 'FeeStructure'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'feeTiers'
						type: {
							array: [
								{
									defined: 'FeeTier'
								},
								10,
							]
						}
					},
					{
						name: 'fillerRewardStructure'
						type: {
							defined: 'OrderFillerRewardStructure'
						}
					},
					{
						name: 'referrerRewardEpochUpperBound'
						type: 'u64'
					},
					{
						name: 'flatFillerFee'
						type: 'u64'
					},
				]
			}
		},
		{
			name: 'FeeTier'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'feeNumerator'
						type: 'u32'
					},
					{
						name: 'feeDenominator'
						type: 'u32'
					},
					{
						name: 'makerRebateNumerator'
						type: 'u32'
					},
					{
						name: 'makerRebateDenominator'
						type: 'u32'
					},
					{
						name: 'referrerRewardNumerator'
						type: 'u32'
					},
					{
						name: 'referrerRewardDenominator'
						type: 'u32'
					},
					{
						name: 'refereeFeeNumerator'
						type: 'u32'
					},
					{
						name: 'refereeFeeDenominator'
						type: 'u32'
					},
				]
			}
		},
		{
			name: 'OrderFillerRewardStructure'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'rewardNumerator'
						type: 'u32'
					},
					{
						name: 'rewardDenominator'
						type: 'u32'
					},
					{
						name: 'timeBasedRewardLowerBound'
						type: 'u128'
					},
				]
			}
		},
		{
			name: 'UserFees'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'totalFeePaid'
						type: 'u64'
					},
					{
						name: 'totalFeeRebate'
						type: 'u64'
					},
					{
						name: 'totalTokenDiscount'
						type: 'u64'
					},
					{
						name: 'totalRefereeDiscount'
						type: 'u64'
					},
					{
						name: 'totalReferrerReward'
						type: 'u64'
					},
					{
						name: 'currentEpochReferrerReward'
						type: 'u64'
					},
				]
			}
		},
		{
			name: 'SpotPosition'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'scaledBalance'
						type: 'u64'
					},
					{
						name: 'openBids'
						type: 'i64'
					},
					{
						name: 'openAsks'
						type: 'i64'
					},
					{
						name: 'cumulativeDeposits'
						type: 'i64'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'balanceType'
						type: {
							defined: 'SpotBalanceType'
						}
					},
					{
						name: 'openOrders'
						type: 'u8'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 4]
						}
					},
				]
			}
		},
		{
			name: 'PerpPosition'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'lastCumulativeFundingRate'
						type: 'i64'
					},
					{
						name: 'baseAssetAmount'
						type: 'i64'
					},
					{
						name: 'quoteAssetAmount'
						type: 'i64'
					},
					{
						name: 'quoteBreakEvenAmount'
						type: 'i64'
					},
					{
						name: 'quoteEntryAmount'
						type: 'i64'
					},
					{
						name: 'openBids'
						type: 'i64'
					},
					{
						name: 'openAsks'
						type: 'i64'
					},
					{
						name: 'settledPnl'
						type: 'i64'
					},
					{
						name: 'lpShares'
						type: 'u64'
					},
					{
						name: 'lastBaseAssetAmountPerLp'
						type: 'i64'
					},
					{
						name: 'lastQuoteAssetAmountPerLp'
						type: 'i64'
					},
					{
						name: 'remainderBaseAssetAmount'
						type: 'i32'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'openOrders'
						type: 'u8'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 1]
						}
					},
				]
			}
		},
		{
			name: 'Order'
			type: {
				kind: 'struct'
				fields: [
					{
						name: 'slot'
						type: 'u64'
					},
					{
						name: 'price'
						type: 'u64'
					},
					{
						name: 'baseAssetAmount'
						type: 'u64'
					},
					{
						name: 'baseAssetAmountFilled'
						type: 'u64'
					},
					{
						name: 'quoteAssetAmountFilled'
						type: 'u64'
					},
					{
						name: 'triggerPrice'
						type: 'u64'
					},
					{
						name: 'auctionStartPrice'
						type: 'i64'
					},
					{
						name: 'auctionEndPrice'
						type: 'i64'
					},
					{
						name: 'maxTs'
						type: 'i64'
					},
					{
						name: 'oraclePriceOffset'
						type: 'i32'
					},
					{
						name: 'orderId'
						type: 'u32'
					},
					{
						name: 'marketIndex'
						type: 'u16'
					},
					{
						name: 'status'
						type: {
							defined: 'OrderStatus'
						}
					},
					{
						name: 'orderType'
						type: {
							defined: 'OrderType'
						}
					},
					{
						name: 'marketType'
						type: {
							defined: 'MarketType'
						}
					},
					{
						name: 'userOrderId'
						type: 'u8'
					},
					{
						name: 'existingPositionDirection'
						type: {
							defined: 'PositionDirection'
						}
					},
					{
						name: 'direction'
						type: {
							defined: 'PositionDirection'
						}
					},
					{
						name: 'reduceOnly'
						type: 'bool'
					},
					{
						name: 'postOnly'
						type: 'bool'
					},
					{
						name: 'immediateOrCancel'
						type: 'bool'
					},
					{
						name: 'triggerCondition'
						type: {
							defined: 'OrderTriggerCondition'
						}
					},
					{
						name: 'auctionDuration'
						type: 'u8'
					},
					{
						name: 'padding'
						type: {
							array: ['u8', 3]
						}
					},
				]
			}
		},
		{
			name: 'SwapDirection'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Add'
					},
					{
						name: 'Remove'
					},
				]
			}
		},
		{
			name: 'PositionDirection'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Long'
					},
					{
						name: 'Short'
					},
				]
			}
		},
		{
			name: 'SpotFulfillmentType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'SerumV3'
					},
					{
						name: 'None'
					},
				]
			}
		},
		{
			name: 'TwapPeriod'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'FundingPeriod'
					},
					{
						name: 'FiveMin'
					},
				]
			}
		},
		{
			name: 'LiquidationMultiplierType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Discount'
					},
					{
						name: 'Premium'
					},
				]
			}
		},
		{
			name: 'MarginRequirementType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Initial'
					},
					{
						name: 'Maintenance'
					},
				]
			}
		},
		{
			name: 'OracleValidity'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Invalid'
					},
					{
						name: 'TooVolatile'
					},
					{
						name: 'TooUncertain'
					},
					{
						name: 'StaleForMargin'
					},
					{
						name: 'InsufficientDataPoints'
					},
					{
						name: 'StaleForAMM'
					},
					{
						name: 'Valid'
					},
				]
			}
		},
		{
			name: 'DriftAction'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'UpdateFunding'
					},
					{
						name: 'SettlePnl'
					},
					{
						name: 'TriggerOrder'
					},
					{
						name: 'FillOrderMatch'
					},
					{
						name: 'FillOrderAmm'
					},
					{
						name: 'Liquidate'
					},
					{
						name: 'MarginCalc'
					},
					{
						name: 'UpdateTwap'
					},
					{
						name: 'UpdateAMMCurve'
					},
				]
			}
		},
		{
			name: 'PositionUpdateType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Open'
					},
					{
						name: 'Increase'
					},
					{
						name: 'Reduce'
					},
					{
						name: 'Close'
					},
					{
						name: 'Flip'
					},
				]
			}
		},
		{
			name: 'DepositExplanation'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'None'
					},
					{
						name: 'Transfer'
					},
				]
			}
		},
		{
			name: 'DepositDirection'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Deposit'
					},
					{
						name: 'Withdraw'
					},
				]
			}
		},
		{
			name: 'OrderAction'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Place'
					},
					{
						name: 'Cancel'
					},
					{
						name: 'Fill'
					},
					{
						name: 'Trigger'
					},
					{
						name: 'Expire'
					},
				]
			}
		},
		{
			name: 'OrderActionExplanation'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'None'
					},
					{
						name: 'InsufficientFreeCollateral'
					},
					{
						name: 'OraclePriceBreachedLimitPrice'
					},
					{
						name: 'MarketOrderFilledToLimitPrice'
					},
					{
						name: 'OrderExpired'
					},
					{
						name: 'Liquidation'
					},
					{
						name: 'OrderFilledWithAMM'
					},
					{
						name: 'OrderFilledWithAMMJit'
					},
					{
						name: 'OrderFilledWithMatch'
					},
					{
						name: 'OrderFilledWithMatchJit'
					},
					{
						name: 'MarketExpired'
					},
					{
						name: 'RiskingIncreasingOrder'
					},
					{
						name: 'ReduceOnlyOrderIncreasedPosition'
					},
					{
						name: 'OrderFillWithSerum'
					},
					{
						name: 'NoBorrowLiquidity'
					},
				]
			}
		},
		{
			name: 'LPAction'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'AddLiquidity'
					},
					{
						name: 'RemoveLiquidity'
					},
					{
						name: 'SettleLiquidity'
					},
				]
			}
		},
		{
			name: 'LiquidationType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'LiquidatePerp'
					},
					{
						name: 'LiquidateSpot'
					},
					{
						name: 'LiquidateBorrowForPerpPnl'
					},
					{
						name: 'LiquidatePerpPnlForDeposit'
					},
					{
						name: 'PerpBankruptcy'
					},
					{
						name: 'SpotBankruptcy'
					},
				]
			}
		},
		{
			name: 'SettlePnlExplanation'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'None'
					},
					{
						name: 'ExpiredPosition'
					},
				]
			}
		},
		{
			name: 'StakeAction'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Stake'
					},
					{
						name: 'UnstakeRequest'
					},
					{
						name: 'UnstakeCancelRequest'
					},
					{
						name: 'Unstake'
					},
				]
			}
		},
		{
			name: 'PerpFulfillmentMethod'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'AMM'
						fields: [
							{
								option: 'u64'
							},
						]
					},
					{
						name: 'Match'
					},
				]
			}
		},
		{
			name: 'SpotFulfillmentMethod'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'SerumV3'
					},
					{
						name: 'Match'
					},
				]
			}
		},
		{
			name: 'OracleSource'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Pyth'
					},
					{
						name: 'Switchboard'
					},
					{
						name: 'QuoteAsset'
					},
				]
			}
		},
		{
			name: 'MarketStatus'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Initialized'
					},
					{
						name: 'Active'
					},
					{
						name: 'FundingPaused'
					},
					{
						name: 'AmmPaused'
					},
					{
						name: 'FillPaused'
					},
					{
						name: 'WithdrawPaused'
					},
					{
						name: 'ReduceOnly'
					},
					{
						name: 'Settlement'
					},
					{
						name: 'Delisted'
					},
				]
			}
		},
		{
			name: 'ContractType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Perpetual'
					},
					{
						name: 'Future'
					},
				]
			}
		},
		{
			name: 'ContractTier'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'A'
					},
					{
						name: 'B'
					},
					{
						name: 'C'
					},
					{
						name: 'Speculative'
					},
					{
						name: 'Isolated'
					},
				]
			}
		},
		{
			name: 'SpotBalanceType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Deposit'
					},
					{
						name: 'Borrow'
					},
				]
			}
		},
		{
			name: 'SpotFulfillmentConfigStatus'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Enabled'
					},
					{
						name: 'Disabled'
					},
				]
			}
		},
		{
			name: 'AssetTier'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Collateral'
					},
					{
						name: 'Protected'
					},
					{
						name: 'Cross'
					},
					{
						name: 'Isolated'
					},
					{
						name: 'Unlisted'
					},
				]
			}
		},
		{
			name: 'ExchangeStatus'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Active'
					},
					{
						name: 'FundingPaused'
					},
					{
						name: 'AmmPaused'
					},
					{
						name: 'FillPaused'
					},
					{
						name: 'LiqPaused'
					},
					{
						name: 'WithdrawPaused'
					},
					{
						name: 'Paused'
					},
				]
			}
		},
		{
			name: 'UserStatus'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Active'
					},
					{
						name: 'BeingLiquidated'
					},
					{
						name: 'Bankrupt'
					},
				]
			}
		},
		{
			name: 'AssetType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Base'
					},
					{
						name: 'Quote'
					},
				]
			}
		},
		{
			name: 'OrderStatus'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Init'
					},
					{
						name: 'Open'
					},
					{
						name: 'Filled'
					},
					{
						name: 'Canceled'
					},
				]
			}
		},
		{
			name: 'OrderType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Market'
					},
					{
						name: 'Limit'
					},
					{
						name: 'TriggerMarket'
					},
					{
						name: 'TriggerLimit'
					},
					{
						name: 'Oracle'
					},
				]
			}
		},
		{
			name: 'OrderTriggerCondition'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Above'
					},
					{
						name: 'Below'
					},
					{
						name: 'TriggeredAbove'
					},
					{
						name: 'TriggeredBelow'
					},
				]
			}
		},
		{
			name: 'MarketType'
			type: {
				kind: 'enum'
				variants: [
					{
						name: 'Spot'
					},
					{
						name: 'Perp'
					},
				]
			}
		},
	]
	events: [
		{
			name: 'NewUserRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'userAuthority'
					type: 'publicKey'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'subAccountId'
					type: 'u16'
					index: false
				},
				{
					name: 'name'
					type: {
						array: ['u8', 32]
					}
					index: false
				},
				{
					name: 'referrer'
					type: 'publicKey'
					index: false
				},
			]
		},
		{
			name: 'DepositRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'userAuthority'
					type: 'publicKey'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'direction'
					type: {
						defined: 'DepositDirection'
					}
					index: false
				},
				{
					name: 'depositRecordId'
					type: 'u64'
					index: false
				},
				{
					name: 'amount'
					type: 'u64'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'oraclePrice'
					type: 'i64'
					index: false
				},
				{
					name: 'marketDepositBalance'
					type: 'u128'
					index: false
				},
				{
					name: 'marketWithdrawBalance'
					type: 'u128'
					index: false
				},
				{
					name: 'marketCumulativeDepositInterest'
					type: 'u128'
					index: false
				},
				{
					name: 'marketCumulativeBorrowInterest'
					type: 'u128'
					index: false
				},
				{
					name: 'totalDepositsAfter'
					type: 'u64'
					index: false
				},
				{
					name: 'totalWithdrawsAfter'
					type: 'u64'
					index: false
				},
				{
					name: 'explanation'
					type: {
						defined: 'DepositExplanation'
					}
					index: false
				},
				{
					name: 'transferUser'
					type: {
						option: 'publicKey'
					}
					index: false
				},
			]
		},
		{
			name: 'SpotInterestRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'depositBalance'
					type: 'u128'
					index: false
				},
				{
					name: 'cumulativeDepositInterest'
					type: 'u128'
					index: false
				},
				{
					name: 'borrowBalance'
					type: 'u128'
					index: false
				},
				{
					name: 'cumulativeBorrowInterest'
					type: 'u128'
					index: false
				},
				{
					name: 'optimalUtilization'
					type: 'u32'
					index: false
				},
				{
					name: 'optimalBorrowRate'
					type: 'u32'
					index: false
				},
				{
					name: 'maxBorrowRate'
					type: 'u32'
					index: false
				},
			]
		},
		{
			name: 'FundingPaymentRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'userAuthority'
					type: 'publicKey'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'fundingPayment'
					type: 'i64'
					index: false
				},
				{
					name: 'baseAssetAmount'
					type: 'i64'
					index: false
				},
				{
					name: 'userLastCumulativeFunding'
					type: 'i64'
					index: false
				},
				{
					name: 'ammCumulativeFundingLong'
					type: 'i128'
					index: false
				},
				{
					name: 'ammCumulativeFundingShort'
					type: 'i128'
					index: false
				},
			]
		},
		{
			name: 'FundingRateRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'recordId'
					type: 'u64'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'fundingRate'
					type: 'i64'
					index: false
				},
				{
					name: 'fundingRateLong'
					type: 'i128'
					index: false
				},
				{
					name: 'fundingRateShort'
					type: 'i128'
					index: false
				},
				{
					name: 'cumulativeFundingRateLong'
					type: 'i128'
					index: false
				},
				{
					name: 'cumulativeFundingRateShort'
					type: 'i128'
					index: false
				},
				{
					name: 'oraclePriceTwap'
					type: 'i64'
					index: false
				},
				{
					name: 'markPriceTwap'
					type: 'u64'
					index: false
				},
				{
					name: 'periodRevenue'
					type: 'i64'
					index: false
				},
				{
					name: 'baseAssetAmountWithAmm'
					type: 'i128'
					index: false
				},
				{
					name: 'baseAssetAmountWithUnsettledLp'
					type: 'i128'
					index: false
				},
			]
		},
		{
			name: 'CurveRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'recordId'
					type: 'u64'
					index: false
				},
				{
					name: 'pegMultiplierBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'baseAssetReserveBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'quoteAssetReserveBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'sqrtKBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'pegMultiplierAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'baseAssetReserveAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'quoteAssetReserveAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'sqrtKAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'baseAssetAmountLong'
					type: 'u128'
					index: false
				},
				{
					name: 'baseAssetAmountShort'
					type: 'u128'
					index: false
				},
				{
					name: 'baseAssetAmountWithAmm'
					type: 'i128'
					index: false
				},
				{
					name: 'totalFee'
					type: 'i128'
					index: false
				},
				{
					name: 'totalFeeMinusDistributions'
					type: 'i128'
					index: false
				},
				{
					name: 'adjustmentCost'
					type: 'i128'
					index: false
				},
				{
					name: 'oraclePrice'
					type: 'i64'
					index: false
				},
				{
					name: 'fillRecord'
					type: 'u128'
					index: false
				},
				{
					name: 'numberOfUsers'
					type: 'u32'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
			]
		},
		{
			name: 'OrderRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'order'
					type: {
						defined: 'Order'
					}
					index: false
				},
			]
		},
		{
			name: 'OrderActionRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'action'
					type: {
						defined: 'OrderAction'
					}
					index: false
				},
				{
					name: 'actionExplanation'
					type: {
						defined: 'OrderActionExplanation'
					}
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'marketType'
					type: {
						defined: 'MarketType'
					}
					index: false
				},
				{
					name: 'filler'
					type: {
						option: 'publicKey'
					}
					index: false
				},
				{
					name: 'fillerReward'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'fillRecordId'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'baseAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'quoteAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'takerFee'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'makerFee'
					type: {
						option: 'i64'
					}
					index: false
				},
				{
					name: 'referrerReward'
					type: {
						option: 'u32'
					}
					index: false
				},
				{
					name: 'quoteAssetAmountSurplus'
					type: {
						option: 'i64'
					}
					index: false
				},
				{
					name: 'spotFulfillmentMethodFee'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'taker'
					type: {
						option: 'publicKey'
					}
					index: false
				},
				{
					name: 'takerOrderId'
					type: {
						option: 'u32'
					}
					index: false
				},
				{
					name: 'takerOrderDirection'
					type: {
						option: {
							defined: 'PositionDirection'
						}
					}
					index: false
				},
				{
					name: 'takerOrderBaseAssetAmount'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'takerOrderCumulativeBaseAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'takerOrderCumulativeQuoteAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'maker'
					type: {
						option: 'publicKey'
					}
					index: false
				},
				{
					name: 'makerOrderId'
					type: {
						option: 'u32'
					}
					index: false
				},
				{
					name: 'makerOrderDirection'
					type: {
						option: {
							defined: 'PositionDirection'
						}
					}
					index: false
				},
				{
					name: 'makerOrderBaseAssetAmount'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'makerOrderCumulativeBaseAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'makerOrderCumulativeQuoteAssetAmountFilled'
					type: {
						option: 'u64'
					}
					index: false
				},
				{
					name: 'oraclePrice'
					type: 'i64'
					index: false
				},
			]
		},
		{
			name: 'LPRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'action'
					type: {
						defined: 'LPAction'
					}
					index: false
				},
				{
					name: 'nShares'
					type: 'u64'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'deltaBaseAssetAmount'
					type: 'i64'
					index: false
				},
				{
					name: 'deltaQuoteAssetAmount'
					type: 'i64'
					index: false
				},
				{
					name: 'pnl'
					type: 'i64'
					index: false
				},
			]
		},
		{
			name: 'LiquidationRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'liquidationType'
					type: {
						defined: 'LiquidationType'
					}
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'liquidator'
					type: 'publicKey'
					index: false
				},
				{
					name: 'marginRequirement'
					type: 'u128'
					index: false
				},
				{
					name: 'totalCollateral'
					type: 'i128'
					index: false
				},
				{
					name: 'marginFreed'
					type: 'u64'
					index: false
				},
				{
					name: 'liquidationId'
					type: 'u16'
					index: false
				},
				{
					name: 'bankrupt'
					type: 'bool'
					index: false
				},
				{
					name: 'canceledOrderIds'
					type: {
						vec: 'u32'
					}
					index: false
				},
				{
					name: 'liquidatePerp'
					type: {
						defined: 'LiquidatePerpRecord'
					}
					index: false
				},
				{
					name: 'liquidateSpot'
					type: {
						defined: 'LiquidateSpotRecord'
					}
					index: false
				},
				{
					name: 'liquidateBorrowForPerpPnl'
					type: {
						defined: 'LiquidateBorrowForPerpPnlRecord'
					}
					index: false
				},
				{
					name: 'liquidatePerpPnlForDeposit'
					type: {
						defined: 'LiquidatePerpPnlForDepositRecord'
					}
					index: false
				},
				{
					name: 'perpBankruptcy'
					type: {
						defined: 'PerpBankruptcyRecord'
					}
					index: false
				},
				{
					name: 'spotBankruptcy'
					type: {
						defined: 'SpotBankruptcyRecord'
					}
					index: false
				},
			]
		},
		{
			name: 'SettlePnlRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'user'
					type: 'publicKey'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'pnl'
					type: 'i128'
					index: false
				},
				{
					name: 'baseAssetAmount'
					type: 'i64'
					index: false
				},
				{
					name: 'quoteAssetAmountAfter'
					type: 'i64'
					index: false
				},
				{
					name: 'quoteEntryAmount'
					type: 'i64'
					index: false
				},
				{
					name: 'settlePrice'
					type: 'i64'
					index: false
				},
				{
					name: 'explanation'
					type: {
						defined: 'SettlePnlExplanation'
					}
					index: false
				},
			]
		},
		{
			name: 'InsuranceFundRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'spotMarketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'perpMarketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'userIfFactor'
					type: 'u32'
					index: false
				},
				{
					name: 'totalIfFactor'
					type: 'u32'
					index: false
				},
				{
					name: 'vaultAmountBefore'
					type: 'u64'
					index: false
				},
				{
					name: 'insuranceVaultAmountBefore'
					type: 'u64'
					index: false
				},
				{
					name: 'totalIfSharesBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'totalIfSharesAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'amount'
					type: 'i64'
					index: false
				},
			]
		},
		{
			name: 'InsuranceFundStakeRecord'
			fields: [
				{
					name: 'ts'
					type: 'i64'
					index: false
				},
				{
					name: 'userAuthority'
					type: 'publicKey'
					index: false
				},
				{
					name: 'action'
					type: {
						defined: 'StakeAction'
					}
					index: false
				},
				{
					name: 'amount'
					type: 'u64'
					index: false
				},
				{
					name: 'marketIndex'
					type: 'u16'
					index: false
				},
				{
					name: 'insuranceVaultAmountBefore'
					type: 'u64'
					index: false
				},
				{
					name: 'ifSharesBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'userIfSharesBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'totalIfSharesBefore'
					type: 'u128'
					index: false
				},
				{
					name: 'ifSharesAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'userIfSharesAfter'
					type: 'u128'
					index: false
				},
				{
					name: 'totalIfSharesAfter'
					type: 'u128'
					index: false
				},
			]
		},
	]
	errors: [
		{
			code: 6000
			name: 'InvalidSpotMarketAuthority'
			msg: 'Invalid Spot Market Authority'
		},
		{
			code: 6001
			name: 'InvalidInsuranceFundAuthority'
			msg: 'Clearing house not insurance fund authority'
		},
		{
			code: 6002
			name: 'InsufficientDeposit'
			msg: 'Insufficient deposit'
		},
		{
			code: 6003
			name: 'InsufficientCollateral'
			msg: 'Insufficient collateral'
		},
		{
			code: 6004
			name: 'SufficientCollateral'
			msg: 'Sufficient collateral'
		},
		{
			code: 6005
			name: 'MaxNumberOfPositions'
			msg: 'Max number of positions taken'
		},
		{
			code: 6006
			name: 'AdminControlsPricesDisabled'
			msg: 'Admin Controls Prices Disabled'
		},
		{
			code: 6007
			name: 'MarketDelisted'
			msg: 'Market Delisted'
		},
		{
			code: 6008
			name: 'MarketIndexAlreadyInitialized'
			msg: 'Market Index Already Initialized'
		},
		{
			code: 6009
			name: 'UserAccountAndUserPositionsAccountMismatch'
			msg: 'User Account And User Positions Account Mismatch'
		},
		{
			code: 6010
			name: 'UserHasNoPositionInMarket'
			msg: 'User Has No Position In Market'
		},
		{
			code: 6011
			name: 'InvalidInitialPeg'
			msg: 'Invalid Initial Peg'
		},
		{
			code: 6012
			name: 'InvalidRepegRedundant'
			msg: 'AMM repeg already configured with amt given'
		},
		{
			code: 6013
			name: 'InvalidRepegDirection'
			msg: 'AMM repeg incorrect repeg direction'
		},
		{
			code: 6014
			name: 'InvalidRepegProfitability'
			msg: 'AMM repeg out of bounds pnl'
		},
		{
			code: 6015
			name: 'SlippageOutsideLimit'
			msg: 'Slippage Outside Limit Price'
		},
		{
			code: 6016
			name: 'OrderSizeTooSmall'
			msg: 'Order Size Too Small'
		},
		{
			code: 6017
			name: 'InvalidUpdateK'
			msg: 'Price change too large when updating K'
		},
		{
			code: 6018
			name: 'AdminWithdrawTooLarge'
			msg: 'Admin tried to withdraw amount larger than fees collected'
		},
		{
			code: 6019
			name: 'MathError'
			msg: 'Math Error'
		},
		{
			code: 6020
			name: 'BnConversionError'
			msg: 'Conversion to u128/u64 failed with an overflow or underflow'
		},
		{
			code: 6021
			name: 'ClockUnavailable'
			msg: 'Clock unavailable'
		},
		{
			code: 6022
			name: 'UnableToLoadOracle'
			msg: 'Unable To Load Oracles'
		},
		{
			code: 6023
			name: 'PriceBandsBreached'
			msg: 'Price Bands Breached'
		},
		{
			code: 6024
			name: 'ExchangePaused'
			msg: 'Exchange is paused'
		},
		{
			code: 6025
			name: 'InvalidWhitelistToken'
			msg: 'Invalid whitelist token'
		},
		{
			code: 6026
			name: 'WhitelistTokenNotFound'
			msg: 'Whitelist token not found'
		},
		{
			code: 6027
			name: 'InvalidDiscountToken'
			msg: 'Invalid discount token'
		},
		{
			code: 6028
			name: 'DiscountTokenNotFound'
			msg: 'Discount token not found'
		},
		{
			code: 6029
			name: 'ReferrerNotFound'
			msg: 'Referrer not found'
		},
		{
			code: 6030
			name: 'ReferrerStatsNotFound'
			msg: 'ReferrerNotFound'
		},
		{
			code: 6031
			name: 'ReferrerMustBeWritable'
			msg: 'ReferrerMustBeWritable'
		},
		{
			code: 6032
			name: 'ReferrerStatsMustBeWritable'
			msg: 'ReferrerMustBeWritable'
		},
		{
			code: 6033
			name: 'ReferrerAndReferrerStatsAuthorityUnequal'
			msg: 'ReferrerAndReferrerStatsAuthorityUnequal'
		},
		{
			code: 6034
			name: 'InvalidReferrer'
			msg: 'InvalidReferrer'
		},
		{
			code: 6035
			name: 'InvalidOracle'
			msg: 'InvalidOracle'
		},
		{
			code: 6036
			name: 'OracleNotFound'
			msg: 'OracleNotFound'
		},
		{
			code: 6037
			name: 'LiquidationsBlockedByOracle'
			msg: 'Liquidations Blocked By Oracle'
		},
		{
			code: 6038
			name: 'MaxDeposit'
			msg: 'Can not deposit more than max deposit'
		},
		{
			code: 6039
			name: 'CantDeleteUserWithCollateral'
			msg: 'Can not delete user that still has collateral'
		},
		{
			code: 6040
			name: 'InvalidFundingProfitability'
			msg: 'AMM funding out of bounds pnl'
		},
		{
			code: 6041
			name: 'CastingFailure'
			msg: 'Casting Failure'
		},
		{
			code: 6042
			name: 'InvalidOrder'
			msg: 'InvalidOrder'
		},
		{
			code: 6043
			name: 'InvalidOrderMaxTs'
			msg: 'InvalidOrderMaxTs'
		},
		{
			code: 6044
			name: 'InvalidOrderMarketType'
			msg: 'InvalidOrderMarketType'
		},
		{
			code: 6045
			name: 'InvalidOrderForInitialMarginReq'
			msg: 'InvalidOrderForInitialMarginReq'
		},
		{
			code: 6046
			name: 'InvalidOrderNotRiskReducing'
			msg: 'InvalidOrderNotRiskReducing'
		},
		{
			code: 6047
			name: 'InvalidOrderSizeTooSmall'
			msg: 'InvalidOrderSizeTooSmall'
		},
		{
			code: 6048
			name: 'InvalidOrderNotStepSizeMultiple'
			msg: 'InvalidOrderNotStepSizeMultiple'
		},
		{
			code: 6049
			name: 'InvalidOrderBaseQuoteAsset'
			msg: 'InvalidOrderBaseQuoteAsset'
		},
		{
			code: 6050
			name: 'InvalidOrderIOC'
			msg: 'InvalidOrderIOC'
		},
		{
			code: 6051
			name: 'InvalidOrderPostOnly'
			msg: 'InvalidOrderPostOnly'
		},
		{
			code: 6052
			name: 'InvalidOrderIOCPostOnly'
			msg: 'InvalidOrderIOCPostOnly'
		},
		{
			code: 6053
			name: 'InvalidOrderTrigger'
			msg: 'InvalidOrderTrigger'
		},
		{
			code: 6054
			name: 'InvalidOrderAuction'
			msg: 'InvalidOrderAuction'
		},
		{
			code: 6055
			name: 'InvalidOrderOracleOffset'
			msg: 'InvalidOrderOracleOffset'
		},
		{
			code: 6056
			name: 'InvalidOrderMinOrderSize'
			msg: 'InvalidOrderMinOrderSize'
		},
		{
			code: 6057
			name: 'PlacePostOnlyLimitFailure'
			msg: 'Failed to Place Post-Only Limit Order'
		},
		{
			code: 6058
			name: 'UserHasNoOrder'
			msg: 'User has no order'
		},
		{
			code: 6059
			name: 'OrderAmountTooSmall'
			msg: 'Order Amount Too Small'
		},
		{
			code: 6060
			name: 'MaxNumberOfOrders'
			msg: 'Max number of orders taken'
		},
		{
			code: 6061
			name: 'OrderDoesNotExist'
			msg: 'Order does not exist'
		},
		{
			code: 6062
			name: 'OrderNotOpen'
			msg: 'Order not open'
		},
		{
			code: 6063
			name: 'FillOrderDidNotUpdateState'
			msg: 'FillOrderDidNotUpdateState'
		},
		{
			code: 6064
			name: 'ReduceOnlyOrderIncreasedRisk'
			msg: 'Reduce only order increased risk'
		},
		{
			code: 6065
			name: 'UnableToLoadAccountLoader'
			msg: 'Unable to load AccountLoader'
		},
		{
			code: 6066
			name: 'TradeSizeTooLarge'
			msg: 'Trade Size Too Large'
		},
		{
			code: 6067
			name: 'UserCantReferThemselves'
			msg: 'User cant refer themselves'
		},
		{
			code: 6068
			name: 'DidNotReceiveExpectedReferrer'
			msg: 'Did not receive expected referrer'
		},
		{
			code: 6069
			name: 'CouldNotDeserializeReferrer'
			msg: 'Could not deserialize referrer'
		},
		{
			code: 6070
			name: 'CouldNotDeserializeReferrerStats'
			msg: 'Could not deserialize referrer stats'
		},
		{
			code: 6071
			name: 'UserOrderIdAlreadyInUse'
			msg: 'User Order Id Already In Use'
		},
		{
			code: 6072
			name: 'NoPositionsLiquidatable'
			msg: 'No positions liquidatable'
		},
		{
			code: 6073
			name: 'InvalidMarginRatio'
			msg: 'Invalid Margin Ratio'
		},
		{
			code: 6074
			name: 'CantCancelPostOnlyOrder'
			msg: 'Cant Cancel Post Only Order'
		},
		{
			code: 6075
			name: 'InvalidOracleOffset'
			msg: 'InvalidOracleOffset'
		},
		{
			code: 6076
			name: 'CantExpireOrders'
			msg: 'CantExpireOrders'
		},
		{
			code: 6077
			name: 'CouldNotLoadMarketData'
			msg: 'CouldNotLoadMarketData'
		},
		{
			code: 6078
			name: 'PerpMarketNotFound'
			msg: 'PerpMarketNotFound'
		},
		{
			code: 6079
			name: 'InvalidMarketAccount'
			msg: 'InvalidMarketAccount'
		},
		{
			code: 6080
			name: 'UnableToLoadPerpMarketAccount'
			msg: 'UnableToLoadMarketAccount'
		},
		{
			code: 6081
			name: 'MarketWrongMutability'
			msg: 'MarketWrongMutability'
		},
		{
			code: 6082
			name: 'UnableToCastUnixTime'
			msg: 'UnableToCastUnixTime'
		},
		{
			code: 6083
			name: 'CouldNotFindSpotPosition'
			msg: 'CouldNotFindSpotPosition'
		},
		{
			code: 6084
			name: 'NoSpotPositionAvailable'
			msg: 'NoSpotPositionAvailable'
		},
		{
			code: 6085
			name: 'InvalidSpotMarketInitialization'
			msg: 'InvalidSpotMarketInitialization'
		},
		{
			code: 6086
			name: 'CouldNotLoadSpotMarketData'
			msg: 'CouldNotLoadSpotMarketData'
		},
		{
			code: 6087
			name: 'SpotMarketNotFound'
			msg: 'SpotMarketNotFound'
		},
		{
			code: 6088
			name: 'InvalidSpotMarketAccount'
			msg: 'InvalidSpotMarketAccount'
		},
		{
			code: 6089
			name: 'UnableToLoadSpotMarketAccount'
			msg: 'UnableToLoadSpotMarketAccount'
		},
		{
			code: 6090
			name: 'SpotMarketWrongMutability'
			msg: 'SpotMarketWrongMutability'
		},
		{
			code: 6091
			name: 'SpotMarketInterestNotUpToDate'
			msg: 'SpotInterestNotUpToDate'
		},
		{
			code: 6092
			name: 'SpotMarketInsufficientDeposits'
			msg: 'SpotMarketInsufficientDeposits'
		},
		{
			code: 6093
			name: 'UserMustSettleTheirOwnPositiveUnsettledPNL'
			msg: 'UserMustSettleTheirOwnPositiveUnsettledPNL'
		},
		{
			code: 6094
			name: 'CantUpdatePoolBalanceType'
			msg: 'CantUpdatePoolBalanceType'
		},
		{
			code: 6095
			name: 'InsufficientCollateralForSettlingPNL'
			msg: 'InsufficientCollateralForSettlingPNL'
		},
		{
			code: 6096
			name: 'AMMNotUpdatedInSameSlot'
			msg: 'AMMNotUpdatedInSameSlot'
		},
		{
			code: 6097
			name: 'AuctionNotComplete'
			msg: 'AuctionNotComplete'
		},
		{
			code: 6098
			name: 'MakerNotFound'
			msg: 'MakerNotFound'
		},
		{
			code: 6099
			name: 'MakerStatsNotFound'
			msg: 'MakerNotFound'
		},
		{
			code: 6100
			name: 'MakerMustBeWritable'
			msg: 'MakerMustBeWritable'
		},
		{
			code: 6101
			name: 'MakerStatsMustBeWritable'
			msg: 'MakerMustBeWritable'
		},
		{
			code: 6102
			name: 'MakerOrderNotFound'
			msg: 'MakerOrderNotFound'
		},
		{
			code: 6103
			name: 'CouldNotDeserializeMaker'
			msg: 'CouldNotDeserializeMaker'
		},
		{
			code: 6104
			name: 'CouldNotDeserializeMakerStats'
			msg: 'CouldNotDeserializeMaker'
		},
		{
			code: 6105
			name: 'AuctionPriceDoesNotSatisfyMaker'
			msg: 'AuctionPriceDoesNotSatisfyMaker'
		},
		{
			code: 6106
			name: 'MakerCantFulfillOwnOrder'
			msg: 'MakerCantFulfillOwnOrder'
		},
		{
			code: 6107
			name: 'MakerOrderMustBePostOnly'
			msg: 'MakerOrderMustBePostOnly'
		},
		{
			code: 6108
			name: 'CantMatchTwoPostOnlys'
			msg: 'CantMatchTwoPostOnlys'
		},
		{
			code: 6109
			name: 'OrderBreachesOraclePriceLimits'
			msg: 'OrderBreachesOraclePriceLimits'
		},
		{
			code: 6110
			name: 'OrderMustBeTriggeredFirst'
			msg: 'OrderMustBeTriggeredFirst'
		},
		{
			code: 6111
			name: 'OrderNotTriggerable'
			msg: 'OrderNotTriggerable'
		},
		{
			code: 6112
			name: 'OrderDidNotSatisfyTriggerCondition'
			msg: 'OrderDidNotSatisfyTriggerCondition'
		},
		{
			code: 6113
			name: 'PositionAlreadyBeingLiquidated'
			msg: 'PositionAlreadyBeingLiquidated'
		},
		{
			code: 6114
			name: 'PositionDoesntHaveOpenPositionOrOrders'
			msg: 'PositionDoesntHaveOpenPositionOrOrders'
		},
		{
			code: 6115
			name: 'AllOrdersAreAlreadyLiquidations'
			msg: 'AllOrdersAreAlreadyLiquidations'
		},
		{
			code: 6116
			name: 'CantCancelLiquidationOrder'
			msg: 'CantCancelLiquidationOrder'
		},
		{
			code: 6117
			name: 'UserIsBeingLiquidated'
			msg: 'UserIsBeingLiquidated'
		},
		{
			code: 6118
			name: 'LiquidationsOngoing'
			msg: 'LiquidationsOngoing'
		},
		{
			code: 6119
			name: 'WrongSpotBalanceType'
			msg: 'WrongSpotBalanceType'
		},
		{
			code: 6120
			name: 'UserCantLiquidateThemself'
			msg: 'UserCantLiquidateThemself'
		},
		{
			code: 6121
			name: 'InvalidPerpPositionToLiquidate'
			msg: 'InvalidPerpPositionToLiquidate'
		},
		{
			code: 6122
			name: 'InvalidBaseAssetAmountForLiquidatePerp'
			msg: 'InvalidBaseAssetAmountForLiquidatePerp'
		},
		{
			code: 6123
			name: 'InvalidPositionLastFundingRate'
			msg: 'InvalidPositionLastFundingRate'
		},
		{
			code: 6124
			name: 'InvalidPositionDelta'
			msg: 'InvalidPositionDelta'
		},
		{
			code: 6125
			name: 'UserBankrupt'
			msg: 'UserBankrupt'
		},
		{
			code: 6126
			name: 'UserNotBankrupt'
			msg: 'UserNotBankrupt'
		},
		{
			code: 6127
			name: 'UserHasInvalidBorrow'
			msg: 'UserHasInvalidBorrow'
		},
		{
			code: 6128
			name: 'DailyWithdrawLimit'
			msg: 'DailyWithdrawLimit'
		},
		{
			code: 6129
			name: 'DefaultError'
			msg: 'DefaultError'
		},
		{
			code: 6130
			name: 'InsufficientLPTokens'
			msg: 'Insufficient LP tokens'
		},
		{
			code: 6131
			name: 'CantLPWithPerpPosition'
			msg: 'Cant LP with a market position'
		},
		{
			code: 6132
			name: 'UnableToBurnLPTokens'
			msg: 'Unable to burn LP tokens'
		},
		{
			code: 6133
			name: 'TryingToRemoveLiquidityTooFast'
			msg: 'Trying to remove liqudity too fast after adding it'
		},
		{
			code: 6134
			name: 'InvalidSpotMarketVault'
			msg: 'Invalid Spot Market Vault'
		},
		{
			code: 6135
			name: 'InvalidSpotMarketState'
			msg: 'Invalid Spot Market State'
		},
		{
			code: 6136
			name: 'InvalidSerumProgram'
			msg: 'InvalidSerumProgram'
		},
		{
			code: 6137
			name: 'InvalidSerumMarket'
			msg: 'InvalidSerumMarket'
		},
		{
			code: 6138
			name: 'InvalidSerumBids'
			msg: 'InvalidSerumBids'
		},
		{
			code: 6139
			name: 'InvalidSerumAsks'
			msg: 'InvalidSerumAsks'
		},
		{
			code: 6140
			name: 'InvalidSerumOpenOrders'
			msg: 'InvalidSerumOpenOrders'
		},
		{
			code: 6141
			name: 'FailedSerumCPI'
			msg: 'FailedSerumCPI'
		},
		{
			code: 6142
			name: 'FailedToFillOnSerum'
			msg: 'FailedToFillOnSerum'
		},
		{
			code: 6143
			name: 'InvalidSerumFulfillmentConfig'
			msg: 'InvalidSerumFulfillmentConfig'
		},
		{
			code: 6144
			name: 'InvalidFeeStructure'
			msg: 'InvalidFeeStructure'
		},
		{
			code: 6145
			name: 'InsufficientIFShares'
			msg: 'Insufficient IF shares'
		},
		{
			code: 6146
			name: 'MarketActionPaused'
			msg: 'the Market has paused this action'
		},
		{
			code: 6147
			name: 'MarketPlaceOrderPaused'
			msg: 'the Market status doesnt allow placing orders'
		},
		{
			code: 6148
			name: 'MarketFillOrderPaused'
			msg: 'the Market status doesnt allow filling orders'
		},
		{
			code: 6149
			name: 'MarketWithdrawPaused'
			msg: 'the Market status doesnt allow withdraws'
		},
		{
			code: 6150
			name: 'ProtectedAssetTierViolation'
			msg: 'Action violates the Protected Asset Tier rules'
		},
		{
			code: 6151
			name: 'IsolatedAssetTierViolation'
			msg: 'Action violates the Isolated Asset Tier rules'
		},
		{
			code: 6152
			name: 'UserCantBeDeleted'
			msg: 'User Cant Be Deleted'
		},
		{
			code: 6153
			name: 'ReduceOnlyWithdrawIncreasedRisk'
			msg: 'Reduce Only Withdraw Increased Risk'
		},
		{
			code: 6154
			name: 'MaxOpenInterest'
			msg: 'Max Open Interest'
		},
		{
			code: 6155
			name: 'CantResolvePerpBankruptcy'
			msg: 'Cant Resolve Perp Bankruptcy'
		},
		{
			code: 6156
			name: 'LiquidationDoesntSatisfyLimitPrice'
			msg: 'Liquidation Doesnt Satisfy Limit Price'
		},
		{
			code: 6157
			name: 'MarginTradingDisabled'
			msg: 'Margin Trading Disabled'
		},
		{
			code: 6158
			name: 'InvalidMarketStatusToSettlePnl'
			msg: 'Invalid Market Status to Settle Perp Pnl'
		},
		{
			code: 6159
			name: 'PerpMarketNotInSettlement'
			msg: 'PerpMarketNotInSettlement'
		},
		{
			code: 6160
			name: 'PerpMarketNotInReduceOnly'
			msg: 'PerpMarketNotInReduceOnly'
		},
		{
			code: 6161
			name: 'PerpMarketSettlementBufferNotReached'
			msg: 'PerpMarketSettlementBufferNotReached'
		},
		{
			code: 6162
			name: 'PerpMarketSettlementUserHasOpenOrders'
			msg: 'PerpMarketSettlementUserHasOpenOrders'
		},
		{
			code: 6163
			name: 'PerpMarketSettlementUserHasActiveLP'
			msg: 'PerpMarketSettlementUserHasActiveLP'
		},
		{
			code: 6164
			name: 'UnableToSettleExpiredUserPosition'
			msg: 'UnableToSettleExpiredUserPosition'
		},
		{
			code: 6165
			name: 'UnequalMarketIndexForSpotTransfer'
			msg: 'UnequalMarketIndexForSpotTransfer'
		},
		{
			code: 6166
			name: 'InvalidPerpPositionDetected'
			msg: 'InvalidPerpPositionDetected'
		},
		{
			code: 6167
			name: 'InvalidSpotPositionDetected'
			msg: 'InvalidSpotPositionDetected'
		},
		{
			code: 6168
			name: 'InvalidAmmDetected'
			msg: 'InvalidAmmDetected'
		},
		{
			code: 6169
			name: 'InvalidAmmForFillDetected'
			msg: 'InvalidAmmForFillDetected'
		},
		{
			code: 6170
			name: 'InvalidAmmLimitPriceOverride'
			msg: 'InvalidAmmLimitPriceOverride'
		},
		{
			code: 6171
			name: 'InvalidOrderFillPrice'
			msg: 'InvalidOrderFillPrice'
		},
		{
			code: 6172
			name: 'SpotMarketBalanceInvariantViolated'
			msg: 'SpotMarketBalanceInvariantViolated'
		},
		{
			code: 6173
			name: 'SpotMarketVaultInvariantViolated'
			msg: 'SpotMarketVaultInvariantViolated'
		},
		{
			code: 6174
			name: 'InvalidPDA'
			msg: 'InvalidPDA'
		},
		{
			code: 6175
			name: 'InvalidPDASigner'
			msg: 'InvalidPDASigner'
		},
		{
			code: 6176
			name: 'RevenueSettingsCannotSettleToIF'
			msg: 'RevenueSettingsCannotSettleToIF'
		},
		{
			code: 6177
			name: 'NoRevenueToSettleToIF'
			msg: 'NoRevenueToSettleToIF'
		},
		{
			code: 6178
			name: 'NoAmmPerpPnlDeficit'
			msg: 'NoAmmPerpPnlDeficit'
		},
		{
			code: 6179
			name: 'SufficientPerpPnlPool'
			msg: 'SufficientPerpPnlPool'
		},
		{
			code: 6180
			name: 'InsufficientPerpPnlPool'
			msg: 'InsufficientPerpPnlPool'
		},
		{
			code: 6181
			name: 'PerpPnlDeficitBelowThreshold'
			msg: 'PerpPnlDeficitBelowThreshold'
		},
		{
			code: 6182
			name: 'MaxRevenueWithdrawPerPeriodReached'
			msg: 'MaxRevenueWithdrawPerPeriodReached'
		},
		{
			code: 6183
			name: 'MaxIFWithdrawReached'
			msg: 'InvalidSpotPositionDetected'
		},
		{
			code: 6184
			name: 'NoIFWithdrawAvailable'
			msg: 'NoIFWithdrawAvailable'
		},
		{
			code: 6185
			name: 'InvalidIFUnstake'
			msg: 'InvalidIFUnstake'
		},
		{
			code: 6186
			name: 'InvalidIFUnstakeSize'
			msg: 'InvalidIFUnstakeSize'
		},
		{
			code: 6187
			name: 'InvalidIFUnstakeCancel'
			msg: 'InvalidIFUnstakeCancel'
		},
		{
			code: 6188
			name: 'InvalidIFForNewStakes'
			msg: 'InvalidIFForNewStakes'
		},
		{
			code: 6189
			name: 'InvalidIFRebase'
			msg: 'InvalidIFRebase'
		},
		{
			code: 6190
			name: 'InvalidInsuranceUnstakeSize'
			msg: 'InvalidInsuranceUnstakeSize'
		},
		{
			code: 6191
			name: 'InvalidOrderLimitPrice'
			msg: 'InvalidOrderLimitPrice'
		},
		{
			code: 6192
			name: 'InvalidIFDetected'
			msg: 'InvalidIFDetected'
		},
		{
			code: 6193
			name: 'InvalidAmmMaxSpreadDetected'
			msg: 'InvalidAmmMaxSpreadDetected'
		},
		{
			code: 6194
			name: 'InvalidConcentrationCoef'
			msg: 'InvalidConcentrationCoef'
		},
		{
			code: 6195
			name: 'InvalidSrmVault'
			msg: 'InvalidSrmVault'
		},
		{
			code: 6196
			name: 'InvalidVaultOwner'
			msg: 'InvalidVaultOwner'
		},
		{
			code: 6197
			name: 'InvalidMarketStatusForFills'
			msg: 'InvalidMarketStatusForFills'
		},
		{
			code: 6198
			name: 'IFWithdrawRequestInProgress'
			msg: 'IFWithdrawRequestInProgress'
		},
		{
			code: 6199
			name: 'NoIFWithdrawRequestInProgress'
			msg: 'NoIFWithdrawRequestInProgress'
		},
		{
			code: 6200
			name: 'IFWithdrawRequestTooSmall'
			msg: 'IFWithdrawRequestTooSmall'
		},
		{
			code: 6201
			name: 'IncorrectSpotMarketAccountPassed'
			msg: 'IncorrectSpotMarketAccountPassed'
		},
		{
			code: 6202
			name: 'BlockchainClockInconsistency'
			msg: 'BlockchainClockInconsistency'
		},
		{
			code: 6203
			name: 'InvalidIFSharesDetected'
			msg: 'InvalidIFSharesDetected'
		},
		{
			code: 6204
			name: 'NewLPSizeTooSmall'
			msg: 'NewLPSizeTooSmall'
		},
		{
			code: 6205
			name: 'MarketStatusInvalidForNewLP'
			msg: 'MarketStatusInvalidForNewLP'
		},
		{
			code: 6206
			name: 'InvalidMarkTwapUpdateDetected'
			msg: 'InvalidMarkTwapUpdateDetected'
		},
		{
			code: 6207
			name: 'MarketSettlementAttemptOnActiveMarket'
			msg: 'MarketSettlementAttemptOnActiveMarket'
		},
		{
			code: 6208
			name: 'MarketSettlementRequiresSettledLP'
			msg: 'MarketSettlementRequiresSettledLP'
		},
		{
			code: 6209
			name: 'MarketSettlementAttemptTooEarly'
			msg: 'MarketSettlementAttemptTooEarly'
		},
		{
			code: 6210
			name: 'MarketSettlementTargetPriceInvalid'
			msg: 'MarketSettlementTargetPriceInvalid'
		},
		{
			code: 6211
			name: 'UnsupportedSpotMarket'
			msg: 'UnsupportedSpotMarket'
		},
		{
			code: 6212
			name: 'SpotOrdersDisabled'
			msg: 'SpotOrdersDisabled'
		},
		{
			code: 6213
			name: 'MarketBeingInitialized'
			msg: 'Market Being Initialized'
		},
		{
			code: 6214
			name: 'InvalidUserSubAccountId'
			msg: 'Invalid Sub Account Id'
		},
		{
			code: 6215
			name: 'InvalidTriggerOrderCondition'
			msg: 'Invalid Trigger Order Condition'
		},
		{
			code: 6216
			name: 'InvalidSpotPosition'
			msg: 'Invalid Spot Position'
		},
		{
			code: 6217
			name: 'CantTransferBetweenSameUserAccount'
			msg: 'Cant transfer between same user account'
		},
		{
			code: 6218
			name: 'InvalidPerpPosition'
			msg: 'Invalid Perp Position'
		},
		{
			code: 6219
			name: 'UnableToGetLimitPrice'
			msg: 'Unable To Get Limit Price'
		},
		{
			code: 6220
			name: 'InvalidLiquidation'
			msg: 'Invalid Liquidation'
		},
		{
			code: 6221
			name: 'SpotFulfillmentConfigDisabled'
			msg: 'Spot Fulfullment Config Disabled'
		},
		{
			code: 6222
			name: 'InvalidMaker'
			msg: 'Invalid Maker'
		},
	]
}
