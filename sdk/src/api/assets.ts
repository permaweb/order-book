import { ArweaveClient } from '../clients/arweave';
import { getAssetsByIds } from '../gql';
import {
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

export async function getAssetsByContract(): Promise<AssetType[]> {
	const arClient = ArweaveClient.init();
	const contract = arClient.warpDefault.contract(ORDERBOOK_CONTRACT).setEvaluationOptions({
		allowBigInt: true,
		remoteStateSyncEnabled: true,
		unsafeClient: 'skip',
		internalWrites: true,
	});
	try {
		const pairs: OrderBookPairType[] = ((await contract.readState()) as any).cachedValue.state.pairs;
		const assets = pairs.filter((pair: OrderBookPairType) => pair.orders.length > 0);

		const gqlData: AssetsResponseType = await getAssetsByIds({
			ids: assets.map((asset: OrderBookPairType) => asset.pair[0]),
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
		});

		return getValidatedAssets(gqlData, assets);
	} catch (error: any) {
		console.error(error);
	}
	return [];
}

export async function getAssetsByUser(args: { walletAddress: string }): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		const assetIds = ((await result.json()) as UserBalancesType).balances.map((balance: BalanceType) => {
			return balance.contract_tx_id
		});
		const gqlData: AssetsResponseType = await getAssetsByIds({
			ids: assetIds,
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
		});

		return getValidatedAssets(gqlData);
	}
	return [];
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
