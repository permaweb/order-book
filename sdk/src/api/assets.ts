import { getGqlDataByIds } from '../gql';
import {
	AssetArgsClientType,
	AssetDetailType,
	AssetsResponseType,
	AssetType,
	BalanceType,
	getBalancesEndpoint,
	getTagValue,
	GQLResponseType,
	ORDERBOOK_CONTRACT,
	OrderBookPairOrderType,
	OrderBookPairType,
	STORAGE,
	TAGS,
	UDL_ICONS,
	UDL_LICENSE_VALUE,
	UDLType,
	UserBalancesType,
} from '../helpers';

export async function getAssetsByContract(args: AssetArgsClientType): Promise<AssetType[]> {
	try {
		const assets: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;

		const ids = assets.map((asset: OrderBookPairType) => {
			return asset.pair[0];
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: ids,
			owner: args.owner,
			uploader: args.uploader,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
			walletAddress: args.walletAddress,
		});

		return getValidatedAssets(gqlData, assets);
	} catch (error: any) {
		console.error(error);
	}
	return [];
}

export async function getAssetIdsByContract(args: { arClient: any }): Promise<string[]> {
	try {
		let r = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs
			.map((asset: OrderBookPairType) => {
				return asset.pair[0];
			})
			.reverse();
		return r;
	} catch (e: any) {
		return [];
	}
}

export async function getAssetsByUser(args: AssetArgsClientType): Promise<AssetType[]> {
	const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
	if (result.status === 200) {
		let balances = ((await result.json()) as UserBalancesType).balances;

		let assetIds = balances.map((balance: BalanceType) => {
			return balance.contract_tx_id;
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: assetIds,
			owner: args.owner,
			uploader: args.uploader,
			cursor: args.cursor,
			reduxCursor: args.reduxCursor,
			arClient: args.arClient,
			walletAddress: args.walletAddress,
		});

		return getValidatedAssets(gqlData);
	}
	return [];
}

export async function getAssetIdsByUser(args: { walletAddress: string; arClient: any }): Promise<string[]> {
	try {
		const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
		if (result.status === 200) {
			let balances = ((await result.json()) as UserBalancesType).balances;

			let assetIds = balances
				.filter((balance: BalanceType) => {
					return balance.balance && parseInt(balance.balance) !== 0;
				})
				.map((balance: BalanceType) => {
					return balance.contract_tx_id;
				});
			return assetIds;
		} else {
			return [];
		}
	} catch (e: any) {
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
		walletAddress: args.walletAddress,
	});

	const pairs: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;

	return getValidatedAssets(gqlData, pairs);
}

export async function getAssetById(args: {
	id: string;
	arClient: any;
	orderBookContract: string;
}): Promise<AssetDetailType> {
	const asset = (
		await getAssetsByIds({
			ids: [args.id],
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			walletAddress: null,
			arClient: args.arClient,
		})
	)[0];

	if (asset) {
		const state = await args.arClient.read(args.id);
		let orders = [];
		let orderBookState = await args.arClient.read(args.orderBookContract);
		let pair = orderBookState.pairs.find((p: any) => {
			return p.pair[0] === args.id;
		});
		if (pair) {
			orders = pair.orders.map((order: OrderBookPairOrderType) => {
				return { ...order, currency: pair.pair[1] };
			});
		}
		return { ...asset, state: state, orders: orders };
	} else {
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
					license: license,
					renderWith: renderWith ? renderWith : null,
					dateCreated: gqlData.assets[i].node.block.timestamp,
					blockHeight: gqlData.assets[i].node.block.height,
					creator: gqlData.assets[i].node.owner.address,
				},
			};

			const udl = getUDL(gqlData.assets[i]);
			if (udl) asset.data.udl = udl;

			if (pairs) {
				const assetIndex = pairs.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.assets[i].node.id);
				if (assetIndex !== -1) {
					asset.orders = pairs[assetIndex].orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: pairs[assetIndex].pair[1] };
					});
				}
			}
			validatedAssets.push(asset);
		}
	}
	return validatedAssets;
}

function getUDL(gqlData: GQLResponseType): UDLType | null {
	const license = getTagValue(gqlData.node.tags, TAGS.keys.udl.license);
	if (!license || license === STORAGE.none || !(license.toLowerCase() === UDL_LICENSE_VALUE.toLowerCase())) return null;

	let currencyIcon: string;
	let currencyEndText: string;
	const currencyType = getTagValue(gqlData.node.tags, TAGS.keys.udl.currency);
	if (!currencyType || currencyType === STORAGE.none) currencyIcon = UDL_ICONS.u;
	else currencyEndText = currencyType;

	let accessFee = { key: TAGS.keys.udl.accessFee, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.accessFee) };
	let derivationFee = {
		key: TAGS.keys.udl.derivationFee,
		value: getTagValue(gqlData.node.tags, TAGS.keys.udl.derivationFee),
	};
	let commercialFee = {
		key: TAGS.keys.udl.commercialFee,
		value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercialFee),
	};

	if (currencyIcon) {
		accessFee['icon'] = currencyIcon;
		derivationFee['icon'] = currencyIcon;
		commercialFee['icon'] = currencyIcon;
	}

	if (currencyEndText) {
		accessFee['endText'] = currencyEndText;
		derivationFee['endText'] = currencyEndText;
		commercialFee['endText'] = currencyEndText;
	}

	return {
		license: { key: TAGS.keys.udl.license, value: license },
		access: { key: TAGS.keys.udl.access, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.access) },
		accessFee: accessFee,
		commercial: { key: TAGS.keys.udl.commercial, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercial) },
		commercialFee: commercialFee,
		derivation: { key: TAGS.keys.udl.derivation, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.derivation) },
		derivationFee: derivationFee,
		paymentMode: { key: TAGS.keys.udl.paymentMode, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.paymentMode) },
	};
}
