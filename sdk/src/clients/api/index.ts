import { ApiClientType, ApiClientInitArgs } from "../../helpers";


const apiClient: ApiClientType = {
    arClient: null,

    init: function (args: ApiClientInitArgs) {
		this.arClient = args.arClient;
		return this;
	},


}

export { apiClient as ApiClient };