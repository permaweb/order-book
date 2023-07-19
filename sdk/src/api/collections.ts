import { getGQLData, getGqlDataByIds } from '../gql';
import {
	ArweaveClientType,
	CollectionManifestType,
	CollectionType,
	CollectionWithAssetsType,
	DEFAULT_COLLECTION_BANNER,
	DEFAULT_COLLECTION_THUMB,
	GetCollectionArgs,
	getTagValue,
	getTxEndpoint,
	STORAGE,
	TAGS,
} from '../helpers';

import { getProfile } from './profile';

async function buildCollection(node: any, items: string[] | null, arClient: ArweaveClientType) {
	let banner =
		getTagValue(node.tags, TAGS.keys.banner) !== STORAGE.none
			? getTagValue(node.tags, TAGS.keys.banner)
			: DEFAULT_COLLECTION_BANNER;
	let thumbnail =
		getTagValue(node.tags, TAGS.keys.thumbnail) !== STORAGE.none
			? getTagValue(node.tags, TAGS.keys.thumbnail)
			: DEFAULT_COLLECTION_THUMB;
	let name = getTagValue(node.tags, TAGS.keys.name);
	let title = getTagValue(node.tags, TAGS.keys.ans110.title);
	let description = getTagValue(node.tags, TAGS.keys.ans110.description);
	let type = getTagValue(node.tags, TAGS.keys.ans110.type);

	let profile = await getProfile({
		walletAddress: node.owner.address,
		arClient: arClient,
	});

	let collection = {
		id: node.id,
		banner: banner,
		thumbnail: thumbnail,
		name: name,
		title: title,
		description: description,
		type: type,
		author: {
			address: node.owner.address,
			handle: profile ? profile.handle : null,
		},
		assets: items,
	};

	if (items) {
		collection.assets = items;
	}

	return collection;
}

export async function getCollections(args: { arClient: ArweaveClientType }): Promise<CollectionType[]> {
	let gqlData = await getGQLData({
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.dataProtocol,
				values: [TAGS.values.collection],
			},
		],
		uploader: null,
		cursor: null,
		reduxCursor: null,
		cursorObject: null,
		arClient: args.arClient,
	});
	let collections: CollectionType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		let node = gqlData.data[i].node;
		let name = getTagValue(node.tags, TAGS.keys.name);
		let title = getTagValue(node.tags, TAGS.keys.ans110.title);
		let description = getTagValue(node.tags, TAGS.keys.ans110.description);
		let type = getTagValue(node.tags, TAGS.keys.ans110.type);

		if ([name, title, description, type].includes(STORAGE.none)) continue;

		collections.push(await buildCollection(node, null, args.arClient));
	}
	return collections;
}

export async function getCollection(args: GetCollectionArgs): Promise<CollectionWithAssetsType | null> {
	try {
		let collectionFetch = await fetch(getTxEndpoint(args.collectionId));
		let collection: CollectionManifestType = await collectionFetch.json();
		let collectionGql = await getGQLData({
			ids: [args.collectionId],
			tagFilters: null,
			cursorObject: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
		});

		if (collectionGql.data.length < 1) return null;

		let node = collectionGql.data[0].node;

		return await buildCollection(node, collection.items, args.arClient);
	} catch (error: any) {
		console.error(error);
	}
	return null;
}
