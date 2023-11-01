import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import {
	ANS_FILTER_LIST,
	BalanceType,
	FILTERED_IDS,
	getBalancesEndpoint,
	getTagValue,
	STAMP_CONTRACT,
	STORAGE,
	TAGS,
	UDL_ICONS,
	UserBalancesType,
} from 'permaweb-orderbook';

import { CONTRACT_OPTIONS, GATEWAYS } from 'helpers/config';
import {
	AGQLResponseType,
	AssetDetailType,
	AssetSortType,
	AssetType,
	GQLArgsSortType,
	GQLNodeResponseType,
	OrderBookPairOrderType,
	OrderBookPairType,
	UDLType,
} from 'helpers/types';
import { store } from 'store';

import { getGQLData } from '.';

LoggerFactory.INST.logLevel('fatal');

export async function getAssetById(args: { id: string }): Promise<AssetDetailType> {
	try {
		const gqlResponse = await getGQLData({
			gateway: GATEWAYS.arweave,
			ids: [args.id],
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: null,
		});

		if (gqlResponse && gqlResponse.data.length) {
			const asset = getValidatedAssets(gqlResponse)[0];
			if (asset && store.getState().ucmReducer) {
				const warp = WarpFactory.forMainnet({
					...defaultCacheOptions,
					inMemory: true,
				}).use(new DeployPlugin());

				const contract = warp.contract(args.id).setEvaluationOptions(CONTRACT_OPTIONS);
				const contractState = (await contract.readState()).cachedValue.state as any;

				let orders = [];
				let pair = store.getState().ucmReducer.pairs.find((p: any) => {
					return p.pair[0] === args.id;
				});
				if (pair) {
					orders = pair.orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: pair.pair[1] };
					});
				}
				return { ...asset, state: contractState, orders: orders };
			} else {
				return null;
			}
		}
	} catch (e: any) {
		console.error(e);
		return null;
	}
}

export async function getAssetsByIds(args: GQLArgsSortType): Promise<AssetType[]> {
	try {
		const gqlData: AGQLResponseType = await getGQLData({
			gateway: args.gateway,
			ids: args.ids,
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: args.cursorObjectKey,
		});

		const pairs: OrderBookPairType[] = store.getState().ucmReducer.pairs;
		const validatedAssets = getValidatedAssets(gqlData, pairs);
		return sortAssets(validatedAssets, args.activeSort);
	} catch (e: any) {
		console.error(e);
		return [];
	}
}

export async function getAssetIdsByContract(args: {
	filterListings: boolean;
	activeSort: AssetSortType;
}): Promise<string[]> {
	try {
		if (store.getState().ucmReducer) {
			const pairs: OrderBookPairType[] = store.getState().ucmReducer.pairs;
			const sortedPairs = sortPairs(pairs, args.activeSort);

			const ids: string[] = [];
			for (let i = 0; i < sortedPairs.length; i++) {
				if (!args.filterListings) ids.push(sortedPairs[i].pair[0]);
				else {
					if (sortedPairs[i].orders && sortedPairs[i].orders.length > 0) {
						ids.push(sortedPairs[i].pair[0]);
					}
				}
			}
			const finalAssetIds = ids
				.filter((id: string) => !FILTERED_IDS.includes(id))
				.filter((id: string) => {
					return !ANS_FILTER_LIST.includes(id);
				});

			return finalAssetIds;
		} else {
			return [];
		}
	} catch (e: any) {
		console.error(e);
		return [];
	}
}

export async function getAssetIdsByUser(args: {
	warp: any;
	walletAddress: string;
	filterListings: boolean;
	activeSort: AssetSortType;
}): Promise<string[]> {
	try {
		const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
		if (result.status === 200) {
			const balances = ((await result.json()) as UserBalancesType).balances;

			const assetIds = balances
				.filter((balance: BalanceType) => {
					return balance.balance && parseInt(balance.balance) !== 0;
				})
				.filter((balance: BalanceType) => {
					return !ANS_FILTER_LIST.includes(balance.contract_tx_id);
				})
				.map((balance: BalanceType) => {
					return balance.contract_tx_id;
				});

			let finalAssetIds = [...assetIds].filter((id: string) => !FILTERED_IDS.includes(id));
			if (args.filterListings) {
				const contractIds = await getAssetIdsByContract({
					filterListings: args.filterListings,
					activeSort: 'low-to-high',
				});
				finalAssetIds = assetIds.filter((id: string) => contractIds.includes(id));
			}

			return finalAssetIds;
		} else {
			return [];
		}
	} catch (e: any) {
		return [];
	}
}

export function getValidatedAssets(gqlData: AGQLResponseType, pairs?: OrderBookPairType[]): AssetType[] {
	let validatedAssets: AssetType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		let title = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.title);
		let description = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.description);
		let topic = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.topic);
		let type = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.type);
		const implementation = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.implements);
		const license = getTagValue(gqlData.data[i].node.tags, TAGS.keys.ans110.license);
		const renderWith = getTagValue(gqlData.data[i].node.tags, TAGS.keys.renderWith);
		const collectionCode = getTagValue(gqlData.data[i].node.tags, TAGS.keys.collectionCode);
		const creator = getTagValue(gqlData.data[i].node.tags, TAGS.keys.creator);
		const thumbnail = getTagValue(gqlData.data[i].node.tags, TAGS.keys.thumbnail);
		const holderTitle = getTagValue(gqlData.data[i].node.tags, TAGS.keys.holderTitle);
		const dataProtocol = getTagValue(gqlData.data[i].node.tags, TAGS.keys.dataProtocol);

		if (gqlData.data[i].node.id === STAMP_CONTRACT) {
			title = '$STAMP Token';
			description =
				'STAMP is a permaweb protocol for content curation. Creators can publish content on the permaweb that lasts forever; the STAMP protocol enables users to provide proof of attribution to that content. This proof consists of a Signature, Timestamp, and Metadata, to show the content consumed was valued permanently.';
			topic = '$STAMP Token';
			type = '$STAMP Token';
		}

		if (title !== STORAGE.none && dataProtocol !== TAGS.values.collection) {
			let asset: AssetType = {
				data: {
					id: gqlData.data[i].node.id,
					title: title,
					description: description,
					topic: topic,
					type: type,
					implementation: implementation,
					license: license,
					renderWith: renderWith ? renderWith : null,
					holderTitle: holderTitle ? holderTitle : null,
					dateCreated: gqlData.data[i].node.block
						? gqlData.data[i].node.block.timestamp * 1000
						: gqlData.data[i].node.timestamp,
					blockHeight: gqlData.data[i].node.block ? gqlData.data[i].node.block.height : 0,
					creator:
						creator && creator !== STORAGE.none
							? creator
							: gqlData.data[i].node.owner
							? gqlData.data[i].node.owner.address
							: gqlData.data[i].node.address,
					thumbnail: thumbnail,
				},
			};

			if (collectionCode && collectionCode !== STORAGE.none) asset.data.collectionCode = collectionCode;

			const udl = getUDL(gqlData.data[i]);
			if (udl) asset.data.udl = udl;

			if (pairs) {
				const assetIndex = pairs.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.data[i].node.id);
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

function getUDL(gqlData: GQLNodeResponseType): UDLType | null {
	const license = getTagValue(gqlData.node.tags, TAGS.keys.udl.license);
	if (!license || license === STORAGE.none) return null; // || !(license.toLowerCase() === UDL_LICENSE_VALUE.toLowerCase())

	let currencyIcon: string;
	let currencyEndText: string;
	const currencyType = getTagValue(gqlData.node.tags, TAGS.keys.udl.currency);
	if (!currencyType || currencyType === STORAGE.none) currencyIcon = UDL_ICONS.u;
	else currencyEndText = currencyType;

	let accessFee = { key: TAGS.keys.udl.accessFee, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.accessFee) };
	let licenseFee = { key: TAGS.keys.udl.licenseFee, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.licenseFee) };
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
		licenseFee['icon'] = currencyIcon;
	}

	if (currencyEndText) {
		accessFee['endText'] = currencyEndText;
		derivationFee['endText'] = currencyEndText;
		commercialFee['endText'] = currencyEndText;
		licenseFee['endText'] = currencyEndText;
	}

	return {
		license: { key: TAGS.keys.udl.license, value: license },
		access: { key: TAGS.keys.udl.access, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.access) },
		accessFee: accessFee,
		commercial: { key: TAGS.keys.udl.commercial, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercial) },
		commercialFee: commercialFee,
		commercialUse: {
			key: TAGS.keys.udl.commercialUse,
			value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercialUse),
		},
		derivation: { key: TAGS.keys.udl.derivation, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.derivation) },
		derivationFee: derivationFee,
		licenseFee: licenseFee,
		paymentMode: { key: TAGS.keys.udl.paymentMode, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.paymentMode) },
	};
}

export function sortAssets(assets: AssetType[], activeSort: AssetSortType): AssetType[] {
	if (activeSort === 'recently-listed') {
		return assets.reverse();
	}

	const assetsWithOrders = assets.filter((a) => a.orders && a.orders.length > 0);
	const assetsWithoutOrders = assets.filter((a) => !a.orders || a.orders.length === 0);

	assetsWithOrders.sort((a: AssetType, b: AssetType) => {
		const aPrice = a.orders[0].price;
		const bPrice = b.orders[0].price;

		switch (activeSort) {
			case 'low-to-high':
				return aPrice - bPrice;
			case 'high-to-low':
				return bPrice - aPrice;
			default:
				return aPrice - bPrice;
		}
	});

	return [...assetsWithOrders, ...assetsWithoutOrders];
}

export function sortPairs(pairs: OrderBookPairType[], activeSort: AssetSortType): OrderBookPairType[] {
	if (activeSort === 'recently-listed') {
		pairs.reverse();
	}

	const getSortKey = (pair: OrderBookPairType): number => {
		if (!pair.orders || pair.orders.length === 0) return Infinity;
		return pair.orders[0].price;
	};

	const direction = activeSort === 'high-to-low' ? -1 : 1;

	const pairsWithOrders = pairs.filter((pair) => pair.orders && pair.orders.length > 0);
	const pairsWithoutOrders = pairs.filter((pair) => !pair.orders || pair.orders.length === 0);

	pairsWithOrders.sort((a, b) => {
		return direction * (getSortKey(a) - getSortKey(b));
	});

	return [...pairsWithOrders, ...pairsWithoutOrders];
}
