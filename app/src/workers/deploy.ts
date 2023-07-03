const Bundlr = require('@bundlr-network/client');
const Arweave = require('arweave');
const { defaultCacheOptions, WarpFactory } = require('warp-contracts');

const ANT = 'qsxW8tchN_UVORsCSehUxMNbexsDd7hXpWFQi_jt22M';
const DEPLOY_FOLDER = './dist';
const BUNDLR_NODE = 'https://node2.bundlr.network';

(async () => {
    const jwk = JSON.parse(Buffer.from(process.env.DEPLOY_KEY as any, 'base64').toString('utf-8'));

    const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });
    const bundlr = new (Bundlr as any).default(BUNDLR_NODE, 'arweave', jwk);
    const warp = WarpFactory.custom(
        arweave,
        defaultCacheOptions,
        'mainnet'
      ).useArweaveGateway().build()
	
	const warpContract = warp.contract(ANT).connect(jwk)
	const contractState: any = (await warpContract.readState()).cachedValue.state;
	console.log(contractState)

	try {
		console.log(`Deploying ${DEPLOY_FOLDER} folder`);
		const bundlrResult = await bundlr.uploadFolder(DEPLOY_FOLDER, {
			indexFile: 'index.html',
		});

		await new Promise((r) => setTimeout(r, 1000));

		await warpContract.writeInteraction(
			{
				function: 'setRecord',
				subDomain: '@',
				transactionId: bundlrResult.id,
			},
			{ disableBundling: true }
		);

		console.log(`Deployed [${bundlrResult.id}] to [${contractState.name}]`);
	} catch (e: any) {
		console.error(e);
	}
})();
