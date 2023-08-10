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
		whitelistSources: [
			'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ',
			'kP1Ed8AMvaaBrEFjatP4pSmiE_fsRrGS0EcBMQYYiyc',
			'mGxosQexdvrvzYCshzBvj18Xh1QmZX16qFJBuh4qobo',
			'LBcYEl2zwKDApj1Cow1_BYyiicxVV7OCZTexsjk6mB4',
			'XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo',
			'eIAyBgHH-H7Qzw9fj7Austj30QKPQn27eaakvpOUSR8',
			'_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk',
			'TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo',
		],
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
