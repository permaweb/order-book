
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { ArweaveSigner, DeployPlugin, InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';

LoggerFactory.INST.logLevel('fatal');

const GET_ENDPOINT = 'arweave-search.goldsky.com';
const POST_ENDPOINT = 'arweave.net';

const PORT = 443;
const PROTOCOL = 'https';
const TIMEOUT = 40000;
const LOGGING = false;

export default class ArweaveClient {
	arweaveGet: any;
	arweavePost: any;
	warpArweaveGateway: any;
	warpDefault: any;
	arweaveUtils: any;

	constructor() {

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

		this.arweaveUtils = Arweave.utils;

		this.warpArweaveGateway = WarpFactory.forMainnet(defaultCacheOptions, true);

		this.warpDefault = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		}).use(new DeployPlugin());

		this.warpPluginArweaveSigner = this.warpPluginArweaveSigner.bind(this);
		this.warpPluginInjectedArweaveSigner = this.warpPluginInjectedArweaveSigner.bind(this);
	}

	warpPluginArweaveSigner(wallet: any) {
		return new ArweaveSigner(wallet);
	}

	warpPluginInjectedArweaveSigner(wallet: any) {
		return new InjectedArweaveSigner(wallet);
	}
}
