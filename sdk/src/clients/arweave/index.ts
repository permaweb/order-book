import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { ArweaveSigner, InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';

import { ArweaveClientType, WriteContractArgs } from '../../helpers';

LoggerFactory.INST.logLevel('fatal');

const GET_ENDPOINT = 'arweave-search.goldsky.com';
const POST_ENDPOINT = 'arweave.net';

const PORT = 443;
const PROTOCOL = 'https';
const TIMEOUT = 40000;
const LOGGING = false;

const options = {
	allowBigInt: true,
	internalWrites: true,
	remoteStateSyncEnabled: true,
	unsafeClient: 'skip',
};

const arClient: ArweaveClientType = {
	arweaveGet: null,
	arweavePost: null,
	warpDefault: null,

	init: function () {
		this.arweaveGet = Arweave.init({
			host: GET_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		this.arweavePost = Arweave.init({
			host: POST_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		this.warpDefault = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		});

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

	warpPluginArweaveSigner: function (wallet: any) {
		return new ArweaveSigner(wallet);
	},

	warpPluginInjectedArweaveSigner: function (wallet: any) {
		return new InjectedArweaveSigner(wallet);
	},
};

export { arClient as ArweaveClient };
