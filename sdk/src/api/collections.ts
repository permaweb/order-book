import { getGQLData, getGqlDataByIds } from "../gql";
import { 
    ArweaveClientType, 
    CollectionManifestType, 
    CollectionType, 
    CollectionWithAssetsType, 
    DEFAULT_COLLECTION_BANNER, 
    DEFAULT_COLLECTION_THUMB, 
    GetCollectionArgs, 
    STORAGE, 
    getTagValue, 
    getTxEndpoint 
} from "../helpers";
import { getProfile } from "./profile";

async function buildCollection(node: any, items: string[] | null, arClient: ArweaveClientType) {
    let banner = getTagValue(node.tags, "Banner") !== STORAGE.none ? getTagValue(node.tags, "Banner") : DEFAULT_COLLECTION_BANNER;
    let thumbnail = getTagValue(node.tags, "Thumbnail") !== STORAGE.none ? getTagValue(node.tags, "Thumbnail") : DEFAULT_COLLECTION_THUMB;
    let name = getTagValue(node.tags, "Name");
    let title = getTagValue(node.tags, "Title");
    let description = getTagValue(node.tags, "Description");
    let type = getTagValue(node.tags, "Type");

    let profile = await getProfile({
        walletAddress: node.owner.address,
        arClient: arClient
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
            handle: profile ? profile.handle : null
        },
        assets: items,
    };

    if(items) {
        collection.assets = items;
    }

    return collection;
}

export async function getCollections(args: {arClient: ArweaveClientType}) : Promise<CollectionType[]> {
    let gqlData = await getGQLData({
        ids: null,
        tagFilters: [
            {
                name: "Data-Protocol",
                values: ["Collection"]
            }
        ],
        uploader: null,
        cursor: null,
        reduxCursor: null,
        cursorObject: null,
        arClient: args.arClient
    });
    let collections: CollectionType[] = [];
    for(let i = 0; i < gqlData.data.length; i++) {
        let node = gqlData.data[i].node;
        let name = getTagValue(node.tags, "Name");
        let title = getTagValue(node.tags, "Title");
        let description = getTagValue(node.tags, "Description");
        let type = getTagValue(node.tags, "Type");

        // dont return non compliant collections
        if([name, title, description, type].includes(STORAGE.none)) continue;

        collections.push(await buildCollection(node, null, args.arClient));
    }
    return collections;
}

export async function getCollection(args: GetCollectionArgs) : Promise<CollectionWithAssetsType | null>{
	try {
        let collectionFetch = await fetch(getTxEndpoint(args.collectionId));
		let collection:CollectionManifestType = await collectionFetch.json();
        let collectionGql = await getGQLData({
			ids: [args.collectionId],
            tagFilters: null,
            cursorObject: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
		});

        if(collectionGql.data.length < 1) return null;

        let node = collectionGql.data[0].node;

        return await buildCollection(node, collection.items, args.arClient);
	} catch (error: any) {
		console.error(error);
	}
	return null;
}
