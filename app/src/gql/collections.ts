import { DEFAULT_COLLECTION_BANNER, DEFAULT_COLLECTION_THUMB, getTagValue, STORAGE, TAGS } from 'permaweb-orderbook';

import { FILTERED_IDS, GATEWAYS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import {
	CollectionAssetType,
	CollectionFetchArgs,
	CollectionManifestType,
	CollectionsResponseType,
	CollectionType,
	CursorEnum,
	OrderBookPairType,
} from 'helpers/types';
import { store } from 'store';

import { getAssetIdsByContract, getGQLData, getProfiles, sortPairs } from '.';

export async function getCollection(args: CollectionFetchArgs): Promise<CollectionAssetType | null> {
	try {
		const collectionFetch = await fetch(getTxEndpoint(args.collectionId));
		const collection: CollectionManifestType = await collectionFetch.json();
		const collectionGql = await getGQLData({
			gateway: GATEWAYS.arweave,
			ids: [args.collectionId],
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.idGQL,
		});

		if (collectionGql.data.length < 1) return null;

		const node = collectionGql.data[0].node;
		let items = collection.items;

		if (args.filterListings) {
			const contractIds = await getAssetIdsByContract({
				filterListings: args.filterListings,
				activeSort: args.activeSort,
			});
			items = collection.items.filter((id: string) => contractIds.includes(id));
		} else {
			items = collection.items;
		}

		return await buildCollection({ node, items: items, useProfile: true });
	} catch (error: any) {
		console.error(error);
	}
	return null;
}

export async function getCollections(args: { cursor: string | null }): Promise<CollectionsResponseType> {
	const gqlData = await getGQLData({
		gateway: GATEWAYS.arweave,
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.dataProtocol,
				values: [TAGS.values.collection],
			},
		],
		owners: null,
		cursor: args.cursor,
		reduxCursor: null,
		cursorObjectKey: CursorEnum.GQL,
		minBlock: 1242062,
	});
	const collections: CollectionType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		const node = gqlData.data[i].node;
		const name = getTagValue(node.tags, TAGS.keys.name);
		const title = getTagValue(node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(node.tags, TAGS.keys.ans110.description);
		const type = getTagValue(node.tags, TAGS.keys.ans110.type);

		if ([name, title, description, type].includes(STORAGE.none)) continue;

		collections.push(await buildCollection({ node, items: null, useProfile: false }));
	}

	const finalCollections = [...collections].filter(
		(collection: CollectionType) => !FILTERED_IDS.includes(collection.id)
	);

	return {
		previousCursor: null,
		nextCursor: gqlData.nextCursor,
		collections: finalCollections,
	};
}

export async function getCollectionByCode(args: { collectionCode: string }): Promise<CollectionAssetType | null> {
	try {
		let cursor: string | null = null;
		const initCollectionGql = await getGQLData({
			gateway: GATEWAYS.arweave,
			ids: null,
			tagFilters: [{ name: TAGS.keys.collectionCode, values: [args.collectionCode] }],
			owners: null,
			cursor: cursor,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		cursor = initCollectionGql.nextCursor;
		// let endCheck: boolean = cursor === CURSORS.end;
		// if (endCheck) {
		if (initCollectionGql.data.length < 1) return null;
		else {
			for (let i = 0; i < initCollectionGql.data.length; i++) {
				const node = initCollectionGql.data[i].node;
				const dataProtocol = getTagValue(node.tags, TAGS.keys.dataProtocol);
				if (dataProtocol && dataProtocol.toLowerCase() === TAGS.values.collection.toLowerCase()) {
					return await buildCollection({ node, items: null, useProfile: true });
				}
			}
		}
		// }
		// else {
		// 	let count = 0;
		// 	while (!endCheck || count < 5) {
		// 		count = count + 1;
		// 		const updatedGql = await getGQLData({
		// 			gateway: GATEWAYS.arweave,
		// 			ids: null,
		// 			tagFilters: [{ name: TAGS.keys.collectionCode, values: [args.collectionCode] }],
		// 			owners: null,
		// 			cursor: cursor,
		// 			reduxCursor: null,
		// 			cursorObjectKey: CursorEnum.GQL,
		// 		});

		// 		cursor = updatedGql.nextCursor;
		// 		endCheck = cursor === CURSORS.end;

		// 		if (updatedGql.data.length < 1) return null;
		// 		else {
		// 			for (let i = 0; i < updatedGql.data.length; i++) {
		// 				const node = updatedGql.data[i].node;
		// 				const dataProtocol = getTagValue(node.tags, TAGS.keys.dataProtocol);
		// 				if (dataProtocol && dataProtocol.toLowerCase() === TAGS.values.collection.toLowerCase()) {
		// 					return await buildCollection({ node, items: null, useProfile: true });
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	} catch (error: any) {
		console.error(error);
	}
	return null;
}

async function buildCollection(args: {
	node: any;
	items?: string[] | null;
	useProfile: boolean;
}): Promise<CollectionAssetType> {
	const banner =
		getTagValue(args.node.tags, TAGS.keys.banner) !== STORAGE.none
			? getTagValue(args.node.tags, TAGS.keys.banner)
			: DEFAULT_COLLECTION_BANNER;
	const thumbnail =
		getTagValue(args.node.tags, TAGS.keys.thumbnail) !== STORAGE.none
			? getTagValue(args.node.tags, TAGS.keys.thumbnail)
			: DEFAULT_COLLECTION_THUMB;
	const name = getTagValue(args.node.tags, TAGS.keys.name);
	const title = getTagValue(args.node.tags, TAGS.keys.ans110.title);
	const description = getTagValue(args.node.tags, TAGS.keys.ans110.description);
	const type = getTagValue(args.node.tags, TAGS.keys.ans110.type);
	const creator = getTagValue(args.node.tags, TAGS.keys.creator);

	const creatorProfile = args.useProfile
		? (
				await getProfiles({
					addresses: [creator && creator !== STORAGE.none ? creator : args.node.owner.address],
				})
		  )[0]
		: null;

	let pairs: OrderBookPairType[] = [];
	if (store.getState().ucmReducer) {
		pairs = store.getState().ucmReducer.pairs;
	}

	const collection: CollectionAssetType = {
		id: args.node.id,
		banner: banner,
		thumbnail: thumbnail,
		name: name,
		title: title,
		description: description,
		type: type,
		creator: creatorProfile,
		block: args.node.block,
		floorPrice: args.items ? getFloorPrice(args.items, pairs) : null,
	};

	if (args.items) {
		collection.assets = args.items;
	}

	return collection;
}

function getFloorPrice(assetIds: string[], pairs: OrderBookPairType[]): number {
	const filteredPairs: OrderBookPairType[] = pairs.filter((pair: OrderBookPairType) => assetIds.includes(pair.pair[0]));

	const sortedPairs = sortPairs(filteredPairs, 'low-to-high');
	return sortedPairs && sortedPairs.length && sortedPairs[0].orders && sortedPairs[0].orders.length
		? sortedPairs[0].orders[0].price
		: 0;
}
