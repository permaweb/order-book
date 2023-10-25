import { getGQLData } from '../gql';
import {
	ArweaveClientType,
	CollectionAssetType,
	CollectionManifestType,
	CollectionsResponseType,
	CollectionType,
	CursorEnum,
	CURSORS,
	DEFAULT_COLLECTION_BANNER,
	DEFAULT_COLLECTION_THUMB,
	FILTERED_IDS,
	GetCollectionArgs,
	GetCollectionByCodeArgs,
	getTagValue,
	getTxEndpoint,
	ORDERBOOK_CONTRACT,
	OrderBookPairType,
	STORAGE,
	TAGS,
} from '../helpers';

import { getAssetIdsByContract, sortPairs } from './assets';
import { getProfile } from './profile';

async function buildCollection(args: {
	node: any;
	items?: string[] | null;
	arClient: ArweaveClientType;
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

	const profile = args.useProfile
		? await getProfile({
				walletAddress: creator && creator !== STORAGE.none ? creator : args.node.owner.address,
				arClient: args.arClient,
		  })
		: null;

	const collection: CollectionAssetType = {
		id: args.node.id,
		banner: banner,
		thumbnail: thumbnail,
		name: name,
		title: title,
		description: description,
		type: type,
		creator: profile,
		block: args.node.block,
		floorPrice: args.items ? await getFloorPrice(args.items, args.arClient) : null,
	};

	if (args.items) {
		collection.assets = args.items;
	}

	return collection;
}

export async function getCollections(args: {
	arClient: ArweaveClientType;
	cursor: string | null;
}): Promise<CollectionsResponseType> {
	const gqlData = await getGQLData({
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.dataProtocol,
				values: [TAGS.values.collection],
			},
		],
		uploader: null,
		cursor: args.cursor,
		reduxCursor: null,
		cursorObject: CursorEnum.GQL,
		arClient: args.arClient,
		minBlock: 1242062,
		useArweaveNet: true,
	});
	const collections: CollectionType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		const node = gqlData.data[i].node;
		const name = getTagValue(node.tags, TAGS.keys.name);
		const title = getTagValue(node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(node.tags, TAGS.keys.ans110.description);
		const type = getTagValue(node.tags, TAGS.keys.ans110.type);

		if ([name, title, description, type].includes(STORAGE.none)) continue;

		collections.push(await buildCollection({ node, items: null, arClient: args.arClient, useProfile: false }));
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

export async function getCollection(args: GetCollectionArgs): Promise<CollectionAssetType | null> {
	try {
		const collectionFetch = await fetch(getTxEndpoint(args.collectionId));
		const collection: CollectionManifestType = await collectionFetch.json();
		const collectionGql = await getGQLData({
			ids: [args.collectionId],
			tagFilters: null,
			cursorObject: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
		});

		if (collectionGql.data.length < 1) return null;

		const node = collectionGql.data[0].node;
		let items = collection.items;

		const contractIds = await getAssetIdsByContract({
			arClient: args.arClient,
			filterListings: args.filterListings,
			activeSort: args.activeSort,
		});
		if (args.filterListings) {
			items = collection.items.filter((id: string) => contractIds.includes(id));
		} else {
			// items = contractIds.filter((id: string) => collection.items.includes(id));
			items = collection.items;
		}

		return await buildCollection({ node, items: items, arClient: args.arClient, useProfile: true });
	} catch (error: any) {
		console.error(error);
	}
	return null;
}

export async function getCollectionByCode(args: GetCollectionByCodeArgs): Promise<CollectionAssetType | null> {
	try {
		let cursor: string | null = null;
		const initCollectionGql = await getGQLData({
			ids: null,
			tagFilters: [{ name: TAGS.keys.collectionCode, values: [args.collectionCode] }],
			cursorObject: CursorEnum.GQL,
			uploader: null,
			cursor: cursor,
			reduxCursor: null,
			arClient: args.arClient,
		});

		cursor = initCollectionGql.nextCursor;
		let endCheck: boolean = cursor === CURSORS.end;
		if (endCheck) {
			if (initCollectionGql.data.length < 1) return null;
			else {
				for (let i = 0; i < initCollectionGql.data.length; i++) {
					const node = initCollectionGql.data[i].node;
					const dataProtocol = getTagValue(node.tags, TAGS.keys.dataProtocol);
					if (dataProtocol && dataProtocol.toLowerCase() === TAGS.values.collection.toLowerCase()) {
						return await buildCollection({ node, items: null, arClient: args.arClient, useProfile: true });
					}
				}
			}
		} else {
			while (!endCheck) {
				const updatedGql = await getGQLData({
					ids: null,
					tagFilters: [{ name: TAGS.keys.collectionCode, values: [args.collectionCode] }],
					cursorObject: CursorEnum.GQL,
					uploader: null,
					cursor: cursor,
					reduxCursor: null,
					arClient: args.arClient,
				});

				cursor = updatedGql.nextCursor;
				endCheck = cursor === CURSORS.end;

				if (updatedGql.data.length < 1) return null;
				else {
					for (let i = 0; i < updatedGql.data.length; i++) {
						const node = updatedGql.data[i].node;
						const dataProtocol = getTagValue(node.tags, TAGS.keys.dataProtocol);
						if (dataProtocol && dataProtocol.toLowerCase() === TAGS.values.collection.toLowerCase()) {
							return await buildCollection({ node, items: null, arClient: args.arClient, useProfile: true });
						}
					}
				}
			}
		}
	} catch (error: any) {
		console.error(error);
	}
	return null;
}

async function getFloorPrice(assetIds: string[], arClient: any): Promise<number> {
	const pairs: OrderBookPairType[] = (await arClient.read(ORDERBOOK_CONTRACT)).pairs.filter((pair: OrderBookPairType) =>
		assetIds.includes(pair.pair[0])
	);
	const sortedPairs = sortPairs(pairs, 'low-to-high');
	return sortedPairs && sortedPairs.length && sortedPairs[0].orders && sortedPairs[0].orders.length
		? sortedPairs[0].orders[0].price
		: 0;
}
