import { getGqlDataByIds } from "../gql";
import { AssetsResponseType, CollectionManifestType, CollectionType, CollectionWithAssetsType, GetCollectionArgs, getTxEndpoint } from "../helpers";
import { getValidatedAssets } from "./assets";



export async function getCollections({arClient: ArweaveClientType}) : Promise<CollectionType[]> {
    let collections = [
        {
            id: "pvxq9B446TL96zOsCv6E8-YL1XDPwbLExMaBO9xbtQY",
            banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
            thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
            title: "Title 1",
            description: "Desc 1",
            stamps: {
                total: 5,
                vouched: 2,
            },
            author: {
                address: "asdlkvn....asldkvna",
                handle: "jajablinky"
            }
        },
        {
            id: "pvxq9B446TL96zOsCv6E8-YL1XDPwbLExMaBO9xbtQY",
            banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
            thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
            title: "Title 1",
            description: "Desc 1",
            stamps: {
                total: 5,
                vouched: 2,
            },
            author: {
                address: "asdlkvn....asldkvna",
                handle: "jajablinky"
            }
        },
        {
            id: "pvxq9B446TL96zOsCv6E8-YL1XDPwbLExMaBO9xbtQY",
            banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
            thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
            title: "Title 1",
            description: "Desc 1",
            stamps: {
                total: 5,
                vouched: 2,
            },
            author: {
                address: "asdlkvn....asldkvna",
                handle: "jajablinky"
            }
        }
    ];
    return collections;
}

export async function getCollection(args: GetCollectionArgs) : Promise<CollectionWithAssetsType | null>{
	try {
        let collectionFetch = await fetch(getTxEndpoint(args.collectionId));
		let collection:CollectionManifestType = await collectionFetch.json();
        let collectionGql = await getGqlDataByIds({
			ids: [args.collectionId],
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
			walletAddress: null,
		});

		const gqlData: AssetsResponseType = await getGqlDataByIds({
			ids: collection.items,
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			arClient: args.arClient,
			walletAddress: null,
		});

		return {
            id: args.collectionId,
            banner: "https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40",
            thumbnail: "https://mbxncnknoa66kt4m7fajlej7ggwnhwa4oqdycccaihwvmfjfeiia.arweave.net/YG7RNU1wPeVPjPlAlZE_MazT2Bx0B4EIQEHtVhUlIhA",
            title: "Title 1",
            description: "Desc 1",
            stamps: {
                total: 5,
                vouched: 2,
            },
            author: {
                address: "asdlkvn....asldkvna",
                handle: "jajablinky"
            },
            assets: getValidatedAssets(gqlData)
        };
	} catch (error: any) {
		console.error(error);
	}
	return null;
}
