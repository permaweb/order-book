const Arweave = require('arweave');
const Irys = require('@irys/sdk');
const { defaultCacheOptions, WarpFactory } = require('warp-contracts');

const ANT = 'qsxW8tchN_UVORsCSehUxMNbexsDd7hXpWFQi_jt22M';
const DEPLOY_FOLDER = './dist';
const UPLOAD_NODE = 'https://turbo.ardrive.io';

(async () => {
	const jwk = JSON.parse(Buffer.from(process.env.DEPLOY_KEY as any, 'base64').toString('utf-8'));

	const irys = new Irys({ url: UPLOAD_NODE, token: 'arweave', key: jwk });

	const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });
	const warp = WarpFactory.custom(arweave, defaultCacheOptions, 'mainnet').useArweaveGateway().build();
	const warpContract = warp.contract(ANT).connect(jwk);
	const contractState: any = (await warpContract.readState()).cachedValue.state;

	try {
		console.log(`Deploying ${DEPLOY_FOLDER} folder`);
		const txResult = await irys.uploadFolder(DEPLOY_FOLDER, {
			indexFile: 'index.html',
		});

		await new Promise((r) => setTimeout(r, 1000));

		await warpContract.writeInteraction(
			{
				function: 'setRecord',
				subDomain: '@',
				transactionId: txResult.id,
			},
			{ disableBundling: true }
		);

		console.log(`Deployed [${txResult.id}] to [${contractState.name}]`);
	} catch (e: any) {
		console.error(e);
	}
})();
