import { getAssetsByContract, getAssetsByUser } from '../../api';
import { ApiClientInitArgs, ApiClientType, AssetType, GetAssetsByUserArgs } from '../../helpers';

const apiClient: ApiClientType = {
	arClient: null,

	init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		return this;
	},

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

export { apiClient as ApiClient };
