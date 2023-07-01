<<<<<<< HEAD
import { getGqlDataByIds } from '../gql';
=======
import { ArweaveClient } from '../clients';
import { getAssetsByIds } from '../gql';
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4
import {
	AssetArgsClientType,
	AssetsResponseType,
	AssetType,
	BalanceType,
	getBalancesEndpoint,
	getTagValue,
	ORDERBOOK_CONTRACT,
	AssetDetailType,
	OrderBookPairOrderType,
	OrderBookPairType,
	STORAGE,
	TAGS,
	UserBalancesType,
} from '../helpers';

<<<<<<< HEAD
export async function getAssetsByContract(args: AssetArgsClientType): Promise<AssetType[]> {
	try {
		const assets: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;
=======
export async function getAssetsByContract(args: { arClient: ArweaveClientType }): Promise<AssetType[]> {
	try {
		const pairs: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;
		const assets = pairs.filter((pair: OrderBookPairType) => pair.orders.length > 0);
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4

		const ids = assets.map((asset: OrderBookPairType) => {
			return asset.pair[0]
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: ids,
			owner: args.owner,
			uploader: args.uploader,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
<<<<<<< HEAD
			walletAddress: args.walletAddress
=======
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4
		});

		return getValidatedAssets(gqlData, assets);
	} catch (error: any) {
		console.error(error);
	}
	return [];
}

<<<<<<< HEAD
export async function getAssetIdsByContract(args: { arClient: any }): Promise<string[]> {
	try {
		let r = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs.map((asset: OrderBookPairType) => {
			return asset.pair[0]
		}).reverse();
		return r;
	}
	catch (e: any) {
		return [];
	}
}

export async function getAssetsByUser(args: AssetArgsClientType): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		let balances = ((await result.json()) as UserBalancesType).balances;

		let assetIds = balances.map((balance: BalanceType) => {
			return balance.contract_tx_id
=======
export async function getAssetsByUser(args: {
	walletAddress: string;
	arClient: ArweaveClientType;
}): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		const assetIds = ((await result.json()) as UserBalancesType).balances.map((balance: BalanceType) => {
			return balance.contract_tx_id;
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: assetIds,
<<<<<<< HEAD
			owner: args.owner,
			uploader: args.uploader,
			cursor: args.cursor,
			reduxCursor: args.reduxCursor,
			arClient: args.arClient,
			walletAddress: args.walletAddress
=======
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4
		});

		return getValidatedAssets(gqlData);
	}
	return [];
}

export async function getAssetIdsByUser(args: { walletAddress: string, arClient: any }): Promise<string[]> {
	try {
		const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
		if (result.status === 200) {
			let balances = ((await result.json()) as UserBalancesType).balances;

			let assetIds = balances.map((balance: BalanceType) => {
				return balance.contract_tx_id
			});
			return assetIds;
		}
		else {
			return [];
		}
	}
	catch (e: any) {
		return [];
	}
}

export async function getAssetsByIds(args: AssetArgsClientType): Promise<AssetType[]> {
	const gqlData: AssetsResponseType = await getGqlDataByIds({
		ids: args.ids,
		owner: args.owner,
		uploader: args.uploader,
		cursor: args.cursor,
		reduxCursor: args.reduxCursor,
		arClient: args.arClient,
		walletAddress: args.walletAddress
	});

	const pairs: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;

	return getValidatedAssets(gqlData, pairs);

}

export async function getAssetById(args: { id: string, arClient: any, orderBookContract: string }): Promise<AssetDetailType> {
	const asset = (await getAssetsByIds({
		ids: [args.id],
		owner: null,
		uploader: null,
		cursor: null,
		reduxCursor: null,
		walletAddress: null,
		arClient: args.arClient
	}))[0];

	if (asset) {
		const state = (await args.arClient.read(args.id));
		let orders = [];
		let orderBookState = await args.arClient.read(args.orderBookContract);
		let pair = orderBookState.pairs.find((p: any) => {
			return p.pair[0] === args.id;
		});
		if (pair) {
			orders = pair.orders.map((order: OrderBookPairOrderType) => {
				return { ...order, currency: pair.pair[1] }
			})
		}
		return ({ ...asset, state: state, orders: orders });
	}
	else {
		return null;
	}
}

export function getValidatedAssets(gqlData: AssetsResponseType, pairs?: OrderBookPairType[]): AssetType[] {
	let validatedAssets: AssetType[] = [];
	for (let i = 0; i < gqlData.assets.length; i++) {
		const title = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.description);
		const topic = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.topic);
		const type = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.type);
		const implementation = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.implements);
		const license = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.license);
		const renderWith = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.renderWith);
		
		if (title !== STORAGE.none && description !== STORAGE.none && type !== STORAGE.none) {
			let asset: AssetType = {
				data: {
					id: gqlData.assets[i].node.id,
					title: title,
					description: description,
					topic: topic,
					type: type,
					implementation: implementation,
<<<<<<< HEAD
					license: license,
					renderWith: renderWith ? renderWith : null,
					dateCreated: gqlData.assets[i].node.block.timestamp,
					blockHeight: gqlData.assets[i].node.block.height
				}
			}

			if (pairs) {
				const assetIndex = pairs.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.assets[i].node.id);
				if (assetIndex !== -1) {
					asset.orders = pairs[assetIndex].orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: pairs[assetIndex].pair[1] }
=======
					renderWith: renderWith ? renderWith : null,
				},
			};
			if (assets) {
				const assetIndex = assets.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.assets[i].node.id);
				if (assetIndex !== -1) {
					asset.orders = assets[assetIndex].orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: assets[assetIndex].pair[1] };
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4
					});
				}
			}
			validatedAssets.push(asset);
		}
	}
	return validatedAssets;
}
