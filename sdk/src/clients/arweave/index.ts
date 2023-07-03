import { 
	ArweaveClientInitArgs, 
	ArweaveClientType, 
	WriteContractArgs 
} from '../../helpers';

const options = {
	allowBigInt: true,
	internalWrites: true,
	remoteStateSyncEnabled: true,
	remoteStateSyncSource: 'https://dre-1.warp.cc/contract',
	unsafeClient: 'skip',
};

const arClient: ArweaveClientType = {
	arweaveGet: null,
	arweavePost: null,
	warpDefault: null,

	init: function (args: ArweaveClientInitArgs) {
		this.arweaveGet = args.arweaveGet;

		this.arweavePost = args.arweavePost;

		this.warpDefault = args.warp;

		return this;
	},

	writeContract: async function (args: WriteContractArgs) {
		let res = await this.warpDefault
			.contract(args.contract)
			.connect(args.wallet)
			.setEvaluationOptions(options)
			.writeInteraction(args.input);
		return res;
	},

	read: async function (id: string) {
		return (await this.warpDefault.contract(id).setEvaluationOptions(options).readState()).cachedValue.state;
	},
};

export { arClient as ArweaveClient };
