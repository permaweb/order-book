import {
	ApiClientType,
	ApiClientInitArgs,
	AssetType,
	AssetDetailType,
	AssetArgsType,
	ProfileType
} from "../../helpers";

import { getAssetsByContract, getAssetIdsByContract, getAssetById, getAssetsByIds, getAssetsByUser, getProfile } from "../../api";

const apiClient: ApiClientType = {
	arClient: null,
	orderBookContract: null,

	init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		this.orderBookContract = args.orderBookContract;
		return this;
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
	}
}

export { apiClient as ApiClient };