import { getGqlDataByIds } from '../gql';
import {
	ArweaveClientType,
	AssetsResponseType,
	AssetType,
	BalanceType,
	getBalancesEndpoint,
	getTagValue,
	ORDERBOOK_CONTRACT,
	OrderBookPairOrderType,
	OrderBookPairType,
	STORAGE,
	TAGS,
	UserBalancesType
} from '../helpers';

export async function getAssetsByContract(args: { arClient: ArweaveClientType }): Promise<AssetType[]> {
	try {
		const assets: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs
		// const assets = pairs.filter((pair: OrderBookPairType) => pair.orders.length > 0);

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: assets.map((asset: OrderBookPairType) => asset.pair[0]),
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient
		});

		return getValidatedAssets(gqlData, assets);
	} catch (error: any) {
		console.error(error);
	}
	return [];
}

function containsSubstring(string: string, substrings: string[]): boolean {
	for (let i = 0; i < substrings.length; i++) {
	  const substring: string = substrings[i];
	  if (string.includes(substring)) {
		return true;
	  }
	}
	return false;
  }

export async function getAssetsByUser(args: { walletAddress: string, arClient: ArweaveClientType }): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		let balances = ((await result.json()) as UserBalancesType).balances.filter((a: any) => {
			return containsSubstring(a.token_name, ['Single owner', 'Multiple owner']); 
		});
		let assetIds = balances.map((balance: BalanceType) => {
			return balance.contract_tx_id
		});
		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: assetIds,
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient
		});

		return getValidatedAssets(gqlData);
	}
	return [];
}

export async function getAssetsByIds(args: { assetIds: string[], arClient: ArweaveClientType }): Promise<AssetType[]> {
	const gqlData: AssetsResponseType = await getGqlDataByIds({
		ids: args.assetIds,
		owner: null,
		uploader: null,
		cursor: null,
		reduxCursor: null,
		arClient: args.arClient
	});

	return getValidatedAssets(gqlData);

}

// TODO: validate topic
function getValidatedAssets(gqlData: AssetsResponseType, assets?: OrderBookPairType[]): AssetType[] {
	let validatedAssets: AssetType[] = [];
	for (let i = 0; i < gqlData.assets.length; i++) {
		const title = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.description);
		const topic = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.topic);
		const type = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.type);
		const implementation = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.implements);
		const renderWith = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.renderWith);

		// TODO: all validation checks
		if (title !== STORAGE.none) {
			let asset: AssetType = {
				data: {
					id: gqlData.assets[i].node.id,
					title: title,
					description: description,
					topic: topic,
					type: type,
					implementation: implementation,
					renderWith: renderWith ? renderWith : null
				}
			}
			if (assets) {
				const assetIndex = assets.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.assets[i].node.id);
				if (assetIndex !== -1) {
					asset.orders = assets[assetIndex].orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: assets[assetIndex].pair[1] }
					});
				}
			}
			validatedAssets.push(asset);
		}
	}
	return validatedAssets;
}
