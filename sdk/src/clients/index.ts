import { CURRENCY_DICT, ORDERBOOK_CONTRACT } from '../helpers/config';
import {
	ArweaveClientType,
	EnvType,
	InitArgs,
	OrderBookType,
	SellArgs,
	ApiClientType,
	BuyArgs
} from '../helpers/types';
import { pairExists } from '../helpers/utils';

import { ArweaveClient } from './arweave';
import { ApiClient } from './api';
import { validateAsset, validateSell, validateBuy, getSyncEndpoint } from '../helpers';

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
				warp: args.warp,
				warpDreNode: args.warpDreNode
			})
		};

		let api: ApiClientType = ApiClient.init({ 
			arClient: this.env.arClient, 
			orderBookContract: ORDERBOOK_CONTRACT 
		});
		
		this.api = api;

		return this;
	},

	sell: async function (args: SellArgs) {
		let env: EnvType = this.env;
		let arClient: ArweaveClientType = this.env.arClient;

		let assetState = await arClient.read(args.assetId);
		let orderBookState = await arClient.read(env.orderBookContract);

		await validateAsset({ 
			asset: args.assetId, 
			assetState: assetState, 
			arClient: this.env.arClient
		});

		await validateSell({
			sellArgs: args,
			assetState,
			orderBookState,
		});

		let pair = [args.assetId, env.currencyContract];

		if (!pairExists(pair, orderBookState)) {
			let addPairInput = {
				function: 'addPair',
				pair: [args.assetId, env.currencyContract],
			};

			await arClient.writeContract({
				contract: env.orderBookContract,
				wallet: args.wallet,
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
			wallet: args.wallet,
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
			wallet: args.wallet,
			input: orderInput,
		});

		await arClient.writeContract({
			contract: env.orderBookContract,
			wallet: args.wallet,
			input: {function: 'noop'},
		});

		await arClient.writeContract({
			contract: env.currencyContract,
			wallet: args.wallet,
			input: {function: 'balance'},
		});

		await arClient.writeContract({
			contract: args.assetId,
			wallet: args.wallet,
			input: {function: 'balance'},
		});

		await fetch(getSyncEndpoint(args.assetId));
		await fetch(getSyncEndpoint(env.orderBookContract));
		await fetch(getSyncEndpoint(env.currencyContract));

		return orderTx;
	},

	buy: async function (args: BuyArgs) {
		let env: EnvType = this.env;
		let arClient: ArweaveClientType = this.env.arClient;

		let assetState = await arClient.read(args.assetId);
		let orderBookState = await arClient.read(env.orderBookContract);

		await validateBuy({
			buyArgs: args,
			assetState,
			orderBookState,
			currencyContract: env.currencyContract
		});

		let allowInput = {
			function: 'allow',
			target: env.orderBookContract,
			qty: args.spend,
		};

		let allowTx = await arClient.writeContract({
			contract: env.currencyContract,
			wallet: args.wallet,
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
			wallet: args.wallet,
			input: orderInput,
		});

		await arClient.writeContract({
			contract: env.orderBookContract,
			wallet: args.wallet,
			input: {function: 'noop'},
		});

		await arClient.writeContract({
			contract: env.currencyContract,
			wallet: args.wallet,
			input: {function: 'balance'},
		});
		
		await arClient.writeContract({
			contract: args.assetId,
			wallet: args.wallet,
			input: {function: 'balance'},
		});

		await fetch(getSyncEndpoint(args.assetId));
		await fetch(getSyncEndpoint(env.orderBookContract));
		await fetch(getSyncEndpoint(env.currencyContract));

		return orderTx;
	}
};

export { client as OrderBook };
