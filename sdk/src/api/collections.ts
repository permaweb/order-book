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

async function buildCollection(
	node: any,
	items: string[] | null,
	arClient: ArweaveClientType,
	useProfile: boolean
): Promise<CollectionAssetType> {
	const banner =
		getTagValue(node.tags, TAGS.keys.banner) !== STORAGE.none
			? getTagValue(node.tags, TAGS.keys.banner)
			: DEFAULT_COLLECTION_BANNER;
	const thumbnail =
		getTagValue(node.tags, TAGS.keys.thumbnail) !== STORAGE.none
			? getTagValue(node.tags, TAGS.keys.thumbnail)
			: DEFAULT_COLLECTION_THUMB;
	const name = getTagValue(node.tags, TAGS.keys.name);
	const title = getTagValue(node.tags, TAGS.keys.ans110.title);
	const description = getTagValue(node.tags, TAGS.keys.ans110.description);
	const type = getTagValue(node.tags, TAGS.keys.ans110.type);

	const profile = useProfile
		? await getProfile({
				walletAddress: node.owner.address,
				arClient: arClient,
		  })
		: null;

	const collection = {
		id: node.id,
		banner: banner,
		thumbnail: thumbnail,
		name: name,
		title: title,
		description: description,
		type: type,
		creator: profile,
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
		minBlock: 1236596,
	});
	const collections: CollectionType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		const node = gqlData.data[i].node;
		const name = getTagValue(node.tags, TAGS.keys.name);
		const title = getTagValue(node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(node.tags, TAGS.keys.ans110.description);
		const type = getTagValue(node.tags, TAGS.keys.ans110.type);

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

		return await buildCollection(node, collection.items, args.arClient, true);
	} catch (error: any) {
		console.error(error);
	}
	return null;
}
