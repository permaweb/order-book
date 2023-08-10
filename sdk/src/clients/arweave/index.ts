import Bundlr from '@bundlr-network/client';

import { ArweaveClientInitArgs, ArweaveClientType, BUNDLR_CONFIG, WriteContractArgs } from '../../helpers';

const arClient: ArweaveClientType = {
	arweaveGet: null,
	arweavePost: null,
	bundlr: null,
	warpDefault: null,
	options: {
		allowBigInt: true,
		internalWrites: true,
		remoteStateSyncEnabled: true,
		remoteStateSyncSource: null,
		unsafeClient: 'skip',
	},

	init: function (args: ArweaveClientInitArgs) {
		this.arweaveGet = args.arweaveGet;
		this.arweavePost = args.arweavePost;

		if (args.bundlrKey) this.bundlr = new Bundlr(BUNDLR_CONFIG.node, BUNDLR_CONFIG.currency, args.bundlrKey);

		this.warpDefault = args.warp;
		this.options.remoteStateSyncSource = args.warpDreNode;

		return this;
	},

	writeContract: async function (args: WriteContractArgs) {
		let res = await this.warpDefault
			.contract(args.contract)
			.connect(args.wallet)
			.setEvaluationOptions(this.options)
			.writeInteraction(args.input);
		return res;
	},

	read: async function (id: string) {
		return (await this.warpDefault.contract(id).setEvaluationOptions(this.options).readState()).cachedValue.state;
	},
};

export { arClient as ArweaveClient };
