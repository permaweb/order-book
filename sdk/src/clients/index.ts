import {
	getContractEndpoint,
	getSyncEndpoint,
	getTransactionLink,
	validateAsset,
	validateBuy,
	validateSell,
} from '../helpers';
import { CURRENCY_DICT, ORDERBOOK_CONTRACT } from '../helpers/config';
import {
	ApiClientType,
	ArweaveClientType,
	BuyArgs,
	CancelArgs,
	EnvType,
	InitArgs,
	OrderBookType,
	SellArgs,
} from '../helpers/types';
import { pairExists } from '../helpers/utils';

import { ApiClient } from './api';
import { ArweaveClient } from './arweave';

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
				warpDreNode: args.warpDreNode,
			}),
		};

		let api: ApiClientType = ApiClient.init({
			arClient: this.env.arClient,
			orderBookContract: ORDERBOOK_CONTRACT,
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
			arClient: this.env.arClient,
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
				options: { strict: true }
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
			options: { strict: true , tags: [{name: "Indexed-By", value: "ucm"}]}
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
			options: { strict: true }
		});
    
		let dreNode = env.arClient.options.remoteStateSyncSource.substring(
			0,
			env.arClient.options.remoteStateSyncSource.lastIndexOf('/')
		);

		
		let contractWithErrors = await fetch(getContractEndpoint(env.orderBookContract, dreNode));
		let contractJson = await contractWithErrors.json();
		
		if (orderTx.originalTxId in contractJson.errorMessages) {
			let cancelClaimInput = {
				function: 'cancelClaim',
				transaction: allowTx.originalTxId,
				contract: args.assetId,
				qty: args.qty,
			};

			await arClient.writeContract({
				contract: env.orderBookContract,
				wallet: args.wallet,
				input: cancelClaimInput,
				options: { strict: true }
			});

			throw new Error(`Order Failed, transaction - ${getTransactionLink(orderTx.originalTxId)}`);
		}
		

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
			currencyContract: env.currencyContract,
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
			options: { strict: true }
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
			options: { strict: true }
		});

		let dreNode = env.arClient.options.remoteStateSyncSource.substring(
			0,
			env.arClient.options.remoteStateSyncSource.lastIndexOf('/')
		);

		let contractWithErrors = await fetch(getContractEndpoint(env.orderBookContract, dreNode));
		let contractJson = await contractWithErrors.json();
		if (orderTx.originalTxId in contractJson.errorMessages) {
			let cancelClaimInput = {
				function: 'cancelClaim',
				transaction: allowTx.originalTxId,
				contract: env.currencyContract,
				qty: args.spend,
			};

			await arClient.writeContract({
				contract: env.orderBookContract,
				wallet: args.wallet,
				input: cancelClaimInput,
				options: { strict: true }
			});

			throw new Error(`Order Failed, transaction - ${getTransactionLink(orderTx.originalTxId)}`);
		}

		return orderTx;
	},

	cancel: async function (args: CancelArgs) {
		let env: EnvType = this.env;
		let arClient: ArweaveClientType = this.env.arClient;

		let cancelInput = {
			function: 'cancelOrder',
			orderId: args.orderId,
		};

		let allowTx = await arClient.writeContract({
			contract: env.orderBookContract,
			wallet: args.wallet,
			input: cancelInput,
			options: { strict: true }
		});

		return allowTx;
	}
};

export { client as OrderBook };
