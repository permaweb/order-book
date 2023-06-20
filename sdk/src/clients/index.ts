import { CURRENCY_DICT, ORDERBOOK_CONTRACT } from '../helpers/config';
import { 
	ArweaveClientType, 
	EnvType, 
	InitArgs, 
	OrderBookType, 
	SellArgs, 
	ValidateArgs, 
	ApiClientType, 
	BuyArgs
} from '../helpers/types';
import { pairExists } from '../helpers/utils';

import { ArweaveClient } from './arweave';
import { ApiClient } from './api';

const client: OrderBookType = {
	env: null,
	api: null,

	init: function (args: InitArgs) {
		this.env = {
			orderBookContract: ORDERBOOK_CONTRACT,
			currency: args.currency,
			currencyContract: CURRENCY_DICT[args.currency],
			arClient: ArweaveClient.init({
				arweaveGet: args.arweaveGet,
				arweavePost: args.arweavePost,
				warp: args.warp
			}),
			wallet: args.wallet,
		};

		let api: ApiClientType = ApiClient.init({ arClient: this.env.arClient });
		this.api = api;

		return this;
	},

	sell: async function (args: SellArgs) {
		let env: EnvType = this.env;
		let arClient: ArweaveClientType = this.env.arClient;

		let assetState = await arClient.read(args.assetId);
		let currencyState = await arClient.read(env.currencyContract);
		let orderBookState = await arClient.read(env.orderBookContract);

		this.validateAsset({ asset: args.assetId, assetState: assetState });

		let pair = [args.assetId, env.currencyContract];

		if (!pairExists(pair, orderBookState)) {
			let addPairInput = {
				function: 'addPair',
				pair: [args.assetId, env.currencyContract],
			};

			await arClient.writeContract({
				contract: env.orderBookContract,
				wallet: env.wallet,
				input: addPairInput,
			});
		}

		let allowInput = {
			function: 'allow',
			target: env.orderBookContract,
			qty: args.qty,
		};

		let allowTx = await arClient.writeContract({
			contract: args.assetId,
			wallet: env.wallet,
			input: allowInput,
		});

		let orderInput = {
			function: 'createOrder',
			pair: [args.assetId, env.currencyContract],
			transaction: allowTx.originalTxId,
			qty: args.qty,
			price: args.price,
		};

		let orderTx = await arClient.writeContract({
			contract: env.orderBookContract,
			wallet: env.wallet,
			input: orderInput,
		});

		return orderTx;
	},

	buy: async function (args: BuyArgs) {
		// validate that number is an integer
		// if it is a single unit token, verify that 
		// the spend is the full price 
		// otherwise if it is a multi unit token 
		// verify the spend is within bounds 
		let env: EnvType = this.env;
		let arClient: ArweaveClientType = this.env.arClient;

		let allowInput = {
			function: 'allow',
			target: env.orderBookContract,
			qty: args.spend,
		};

		let allowTx = await arClient.writeContract({
			contract: env.currencyContract,
			wallet: env.wallet,
			input: allowInput,
		});

		let orderInput = {
			function: 'createOrder',
			pair: [env.currencyContract, args.assetId],
			transaction: allowTx.originalTxId,
			qty: args.spend,
		};

		let orderTx = await arClient.writeContract({
			contract: env.orderBookContract,
			wallet: env.wallet,
			input: orderInput,
		});

		return orderTx;
	},

	// TODO: validation incomplete
	validateAsset: async function (args: ValidateArgs) {
		// validate collection if provided
		// validate contract
		// validate asset data (not 404)
		// validate tags

		if (!args.assetState) {
			throw new Error(`No state found for asset`);
		}

		if (!args.assetState.claimable) {
			throw new Error(`No claimable array found in the asset state`);
		}
	}
};

export { client as OrderBook };
export { ArweaveClient } from './arweave';
