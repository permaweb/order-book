import {
	createAsset,
	getAssetById,
	getAssetIdsByContract,
	getAssetIdsByUser,
	getAssetsByContract,
	getAssetsByIds,
	getAssetsByUser,
	getProfile,
	search,
} from '../../api';
import { getCollection, getCollections } from '../../api/collections';
import {
	ApiClientInitArgs,
	ApiClientType,
	AssetArgsType,
	AssetCreateArgsType,
	AssetDetailType,
	AssetType,
	CollectionAssetType,
	CollectionsResponseType,
	ProfileType,
	SearchArgs,
	SearchReturnType,
} from '../../helpers';

const apiClient: ApiClientType = {
	arClient: null,
	orderBookContract: null,

	init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		this.orderBookContract = args.orderBookContract;
		return this;
	},

	createAsset: async function (args: AssetCreateArgsType): Promise<string> {
		return await createAsset({ ...args, arClient: this.arClient });
	},

	getAssetsByContract: async function (args: AssetArgsType): Promise<AssetType[]> {
		return await getAssetsByContract({ ...args, arClient: this.arClient });
	},

	getAssetIdsByContract: async function (): Promise<string[]> {
		return await getAssetIdsByContract({ arClient: this.arClient });
	},

	getAssetsByUser: async function (args: AssetArgsType): Promise<AssetType[]> {
		return await getAssetsByUser({ ...args, arClient: this.arClient });
	},

	getAssetIdsByUser: async function (args: { walletAddress: string }): Promise<string[]> {
		return await getAssetIdsByUser({ ...args, arClient: this.arClient });
	},

	getAssetsByIds: async function (args: AssetArgsType): Promise<AssetType[]> {
		return await getAssetsByIds({ ...args, arClient: this.arClient });
	},

	getAssetById: async function (args: { id: string }): Promise<AssetDetailType> {
		return await getAssetById({ ...args, arClient: this.arClient, orderBookContract: this.orderBookContract });
	},

	getProfile: async function (args: { walletAddress: string }): Promise<ProfileType> {
		return await getProfile({
			walletAddress: args.walletAddress,
			arClient: this.arClient,
		});
	},

	search: async function (args: SearchArgs): Promise<SearchReturnType> {
		return await search({ ...args, arClient: this.arClient });
	},

	getCollection: async function (args: { collectionId: string }): Promise<CollectionAssetType> {
		return await getCollection({ ...args, arClient: this.arClient });
	},

	getCollections: async function (args: { cursor: string | null }): Promise<CollectionsResponseType> {
		return await getCollections({ ...args, arClient: this.arClient });
	},
};

export { apiClient as ApiClient };
