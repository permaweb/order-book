import { getGqlDataByIds } from '../gql';
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
	PAGINATOR,
	STORAGE,
	TAGS,
	UserBalancesType,
	ArweaveClientType
} from '../helpers';

export async function getAssetsByContract(args: AssetArgsClientType): Promise<AssetType[]> {
	try {
		// let cursor: string | null = null;
		// if (args.cursor && args.cursor !== CURSORS.p1 && args.cursor !== CURSORS.end && !checkGqlCursor(args.cursor)) {
		// 	cursor = args.cursor;
		// }

		// if (args.reduxCursor && args.cursorObject && args.cursorObject === CursorEnum.idGQL) {
		// 	let i: number;
		// 	if (args.cursor && args.cursor !== CURSORS.p1 && args.cursor !== CURSORS.end && !checkGqlCursor(args.cursor)) {
		// 		i = Number(args.cursor.slice(-1));
		// 		cursor = args.cursor;
		// 	} else {
		// 		i = 0;
		// 		cursor = `${SEARCH.idGqlcursorPrefix}-${i}`;
		// 	}
		// }

		// console.log(cursor)

		// use args.cursor contractAssets-idGql-${i} to choose ids or send id as cursor to get next from pair list

		const assets: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;

		console.log(`Paginator: ${PAGINATOR}`);
		console.log(`Cursor: ${args.cursor}`);
		console.log(`Redux Cursor: ${args.reduxCursor}`);

		for (let i = 0; i < assets.length; i++) {
			console.log(assets[i].pair[0] === '0BcEIhGv5YOvK-wVl3AgyUGDifAEtcZRQfWrayEwLxU');
		}

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
			walletAddress: args.walletAddress
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
	  if (string && string.includes(substring)) {
		return true;
	  }
	}
	return false;
  }


export async function getAssetIdsByContract(args: { arClient: any }): Promise<string[]> {
	try {
		return (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs
	}
	catch (e: any) {
		return [];
	}
}

// TODO: paginate by page
export async function getAssetsByUser(args: AssetArgsClientType): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		// let balances = ((await result.json()) as UserBalancesType).balances.filter((a: any) => {
		// 	return containsSubstring(a.token_name, ['Single owner', 'Multiple owner']); 
		// });
		let balances = ((await result.json()) as UserBalancesType).balances;
		
		let assetIds = balances.map((balance: BalanceType) => {
			return balance.contract_tx_id
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: assetIds,
			owner: args.owner,
			uploader: args.uploader,
			cursor: args.cursor,
			reduxCursor: args.reduxCursor,
			arClient: args.arClient,
			walletAddress: args.walletAddress
		});

		return getValidatedAssets(gqlData);
	}
	return [];
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

	return getValidatedAssets(gqlData);

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
		if(pair) {
			orders = pair.orders;
		}
		return ({ ...asset, state: state, orders: orders });
	}
	else {
		return null;
	}
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
