<<<<<<< HEAD
import {
	ApiClientType,
	ApiClientInitArgs,
	AssetType,
	AssetDetailType,
	AssetArgsType,
	ProfileType,
	SearchReturnType,
	SearchArgs
} from "../../helpers";

import { 
	getAssetsByContract, 
	getAssetIdsByContract, 
	getAssetById, 
	getAssetsByIds, 
	getAssetsByUser,
	getAssetIdsByUser,
	getProfile,
	search
} from "../../api";

const apiClient: ApiClientType = {
	arClient: null,
	orderBookContract: null,
=======
import { getAssetsByContract, getAssetsByUser } from '../../api';
import { ApiClientInitArgs, ApiClientType, AssetType, GetAssetsByUserArgs } from '../../helpers';

const apiClient: ApiClientType = {
	arClient: null,
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4

	init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		this.orderBookContract = args.orderBookContract;
		return this;
	},

<<<<<<< HEAD
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
			arClient: this.arClient
		})
	},

	search: async function(args: SearchArgs): Promise<SearchReturnType> {
		return await search({...args, arClient: this.arClient});
	}
}
=======
	getAssetsByContract: async function (): Promise<AssetType[]> {
		return await getAssetsByContract({
			arClient: this.arClient,
		});
	},

	getAssetsByUser: async function (args: GetAssetsByUserArgs): Promise<AssetType[]> {
		return await getAssetsByUser({
			walletAddress: args.walletAddress,
			arClient: this.arClient,
		});
	},
};
>>>>>>> 12badc6f8ea763fc85329d5f74e682b1b10b3df4

export { apiClient as ApiClient };
