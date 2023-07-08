import { getGQLData } from '../gql';

import { STORAGE, TAGS } from './config';
import { ValidateAssetArgs, ValidateBuyArgs, ValidateSellArgs } from './types';
import { getTagValue, isSingleQtyAsset } from './utils';

export async function validateSell(args: ValidateSellArgs) {
	if (!args.sellArgs.walletAddress || !args.sellArgs.wallet) {
		throw new Error(`Please call sell with a wallet and wallet address`);
	}

	if (!(args.sellArgs.walletAddress in args.assetState.balances)) {
		throw new Error(`This wallet does not have a balance to sell on this asset`);
	}

	let sellQty = args.sellArgs.qty;
	let walletQty = args.assetState.balances[args.sellArgs.walletAddress];

	if (sellQty % 1 !== 0 || sellQty === 0) {
		throw new Error(`Please provide an integer quantity greater than 0 to sell`);
	}

	// this blocks people trying to sell single assets twice
	// and trying to sell more balance than they have for a pst
	if (sellQty > walletQty) {
		throw new Error(`This wallet does not have enough balance of the asset to sell this amount`);
	}
}

export async function validateBuy(args: ValidateBuyArgs) {
	if (!args.buyArgs.walletAddress || !args.buyArgs.wallet) {
		throw new Error(`Please call buy with a wallet and wallet address`);
	}

	let buySpend = args.buyArgs.spend;

	if (buySpend % 1 !== 0 || buySpend === 0) {
		throw new Error(`Please provide an integer quantity greater than 0 to buy`);
	}

	let pair = args.orderBookState.pairs.find((obj: any) => {
		return obj.pair[0] === args.buyArgs.assetId && obj.pair[1] === args.buyArgs.assetId;
	});

	if (isSingleQtyAsset(args.assetState)) {
		let order = pair.orders[0];
		if (!order) {
			throw new Error(`No sell order present`);
		}
		let price = order.price;
		if (args.buyArgs.spend < price) {
			throw new Error(`Can only spend the full price for a single unit asset`);
		}
	}

	// make sure they have enough U to execute the buy
	// make sure they input a price if there is none
}

export async function validateAsset(args: ValidateAssetArgs) {
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
	if (keys.length < 1) {
		throw new Error(`balances object is empty in the asset state`);
	}

	let gateway = args.arClient.arweavePost.api.config.host;
	let protocol = args.arClient.arweavePost.api.config.protocol;

	const assetResponse = await fetch(`${protocol}://${gateway}/${args.asset}`);

	if (!(assetResponse.status == 200)) {
		throw new Error(`Asset data could not be retrieved`);
	}

	let assetGqlResponse = await getGQLData({
		ids: [args.asset],
		tagFilters: null,
		uploader: null,
		cursor: null,
		reduxCursor: null,
		cursorObject: null,
		arClient: args.arClient,
	});

	if (assetGqlResponse.data.length < 1) {
		throw new Error(`Asset could not be found via gql`);
	}

	let ansTitle = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.title);
	let ansDescription = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.description);
	let ansType = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.type);

	if (ansTitle === STORAGE.none || ansDescription === STORAGE.none || ansType === STORAGE.none) {
		throw new Error(`Asset must contain ANS-110 tags - Title, Description, and Type `);
	}
}
