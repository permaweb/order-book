import {
	ApiClientType,
	ApiClientInitArgs,
	AssetType,
	GetAssetsByUserArgs,
	ProfileType
} from "../../helpers";

import { getAssetsByContract, getAssetsByUser, getProfile } from "../../api";

const apiClient: ApiClientType = {
	arClient: null,

	init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		return this;
	},

	getAssetsByContract: async function (): Promise<AssetType[]> {
		return await getAssetsByContract({
			arClient: this.arClient
		});
	},

	getAssetsByUser: async function (args: GetAssetsByUserArgs): Promise<AssetType[]> {
		return await getAssetsByUser({
			walletAddress: args.walletAddress,
			arClient: this.arClient
		});
	},

	getProfile: async function (args: { walletAddress: string }): Promise<ProfileType> {
		return await getProfile({
			walletAddress: args.walletAddress,
			arClient: this.arClient
		})
	}
}

export { apiClient as ApiClient };