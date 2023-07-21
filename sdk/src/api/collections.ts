import { getGQLData } from '../gql';
import {
	ArweaveClientType,
	CollectionAssetType,
	CollectionManifestType,
	CollectionsResponseType,
	CollectionType,
	CursorEnum,
	DEFAULT_COLLECTION_BANNER,
	DEFAULT_COLLECTION_THUMB,
	GetCollectionArgs,
	getTagValue,
	getTxEndpoint,
	STORAGE,
	TAGS,
} from '../helpers';

import { getProfile } from './profile';

async function buildCollection(node: any, items: string[] | null, arClient: ArweaveClientType, withProfile: boolean) {
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

	let profile = withProfile
		? await getProfile({
				walletAddress: node.owner.address,
				arClient: arClient,
		  })
		: null;

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

export async function getCollections(args: {
	arClient: ArweaveClientType;
	cursor: string | null;
}): Promise<CollectionsResponseType> {
	let gqlData = await getGQLData({
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
		minBlock: 1224710
	});
	let collections: CollectionType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		let node = gqlData.data[i].node;
		let name = getTagValue(node.tags, TAGS.keys.name);
		let title = getTagValue(node.tags, TAGS.keys.ans110.title);
		let description = getTagValue(node.tags, TAGS.keys.ans110.description);
		let type = getTagValue(node.tags, TAGS.keys.ans110.type);

		if ([name, title, description, type].includes(STORAGE.none)) continue;

		collections.push(await buildCollection(node, null, args.arClient, false));
	}
	return {
		previousCursor: null,
		nextCursor: gqlData.nextCursor,
		collections: collections,
	};
}

export async function getCollection(args: GetCollectionArgs): Promise<CollectionAssetType | null> {
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

		return await buildCollection(node, collection.items, args.arClient, true);
	} catch (error: any) {
		console.error(error);
	}
	return null;
}
