import {
	createAsset,
	getActivity,
	getAssetById,
	getAssetIdsByContract,
	getAssetIdsByUser,
	getAssetsByIds,
	getCollection,
	getCollectionByCode,
	getCollections,
	getCommentData,
	getComments,
	getProfile,
	getProfiles,
	search,
} from '../../api';
import {
	ActivityResponseType,
	APIClientInitArgs,
	APIClientType,
	AssetArgsSortType,
	AssetCreateArgsType,
	AssetDetailType,
	AssetSortType,
	AssetType,
	CollectionAssetType,
	CollectionsResponseType,
	CommentDetailType,
	CommentsResponseType,
	ProfileType,
	SearchArgs,
	SearchReturnType,
} from '../../helpers';

const apiClient: APIClientType = {
	arClient: null,
	orderBookContract: null,

	init: function (args: APIClientInitArgs) {
		this.arClient = args.arClient;
		this.orderBookContract = args.orderBookContract;
		return this;
	},

	createAsset: async function (args: AssetCreateArgsType): Promise<string> {
		return await createAsset({ ...args, arClient: this.arClient });
	},

	getActivity: async function (args: { id: string }): Promise<ActivityResponseType> {
		return await getActivity({ ...args, arClient: this.arClient });
	},

	getAssetIdsByContract: async function (args: {
		filterListings: boolean;
		activeSort: AssetSortType;
	}): Promise<string[]> {
		return await getAssetIdsByContract({
			arClient: this.arClient,
			filterListings: args.filterListings,
			activeSort: args.activeSort,
		});
	},

	getAssetIdsByUser: async function (args: {
		walletAddress: string;
		filterListings: boolean;
		activeSort: AssetSortType;
	}): Promise<string[]> {
		return await getAssetIdsByUser({ ...args, arClient: this.arClient });
	},

	getAssetsByIds: async function (args: AssetArgsSortType): Promise<AssetType[]> {
		return await getAssetsByIds({ ...args, arClient: this.arClient });
	},

	getAssetById: async function (args: { id: string }): Promise<AssetDetailType> {
		return await getAssetById({
			...args,
			activeSort: null,
			arClient: this.arClient,
			orderBookContract: this.orderBookContract,
		});
	},

	getProfile: async function (args: { walletAddress: string }): Promise<ProfileType> {
		return await getProfile({
			walletAddress: args.walletAddress,
			arClient: this.arClient,
		});
	},

	getProfiles: async function (args: { addresses: string[] }): Promise<ProfileType[]> {
		return await getProfiles({
			addresses: args.addresses,
			arClient: this.arClient,
		});
	},

	search: async function (args: SearchArgs): Promise<SearchReturnType> {
		return await search({ ...args, arClient: this.arClient });
	},

	getCollection: async function (args: {
		collectionId: string;
		filterListings: boolean;
		activeSort: AssetSortType;
	}): Promise<CollectionAssetType> {
		return await getCollection({ ...args, arClient: this.arClient });
	},

	getCollectionByCode: async function (args: { collectionCode: string }): Promise<CollectionAssetType> {
		return await getCollectionByCode({ ...args, arClient: this.arClient });
	},

	getCollections: async function (args: { cursor: string | null }): Promise<CollectionsResponseType> {
		return await getCollections({ ...args, arClient: this.arClient });
	},

	getComments: async function (args: { id: string; cursor: string }): Promise<CommentsResponseType> {
		return await getComments({ ...args, arClient: this.arClient });
	},

	getCommentData: async function (args: { id: string }): Promise<CommentDetailType> {
		return await getCommentData({ ...args, arClient: this.arClient });
	},
};

export { apiClient as APIClient };
