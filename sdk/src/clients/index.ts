import { CURRENCY_DICT, ORDERBOOK_CONTRACT, STORAGE, TAGS } from '../helpers/config';
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
import { getTagValue, pairExists } from '../helpers/utils';

import { ArweaveClient } from './arweave';
import { ApiClient } from './api';
import { getGQLData } from '../gql';

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

		await this.validateAsset({ asset: args.assetId, assetState: assetState });

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

		if (!args.assetState) {
			throw new Error(`Could not retrieve state for the asset`);
		}

		if (!args.assetState.claimable) {
			throw new Error(`No claimable array found in the asset state`);
		}

		if (!args.assetState.balances) {
			throw new Error(`No balances object found in the asset state`);
		}

		let keys = Object.keys(args.assetState.balances);
  		if(keys.length < 1) {
			throw new Error(`balances object is empty in the asset state`);
		}

		let gateway = this.env.arClient.arweavePost.api.config.host;
		let protocol = this.env.arClient.arweavePost.api.config.protocol;
		
		const assetResponse = await fetch(`${protocol}://${gateway}/${args.asset}`);

		if(!(assetResponse.status == 200)) {
			throw new Error(`Asset data could not be retrieved`);
		}

		let assetGqlResponse = await getGQLData({
				ids: [args.asset],
				tagFilters: null,
				uploader: null,
				cursor: null,
				reduxCursor: null,
				cursorObject: null,
				arClient: this.env.arClient
		});

		if(assetGqlResponse.data.length < 1) {
			throw new Error(`Asset could not be found via gql`);
		}

		let ansTitle = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.title);
		let ansDescription = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.description);
		let ansType = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.type);

		if((ansTitle === STORAGE.none) || (ansDescription === STORAGE.none) || (ansType === STORAGE.none)) {
			throw new Error(`Asset must contain ANS-110 tags - Title, Description, and Type `);
		}
	}
};

export { client as OrderBook };
export { ArweaveClient } from './arweave';
export { ApiClient } from './api';
