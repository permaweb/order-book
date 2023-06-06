import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import fs from 'fs';
import { execSync } from 'child_process';

async function deploy(folder) {
  try {
    const warp = WarpFactory.forLocal().use(new DeployPlugin());
    const wallet1 = await warp.generateWallet();

    const contractSrc = fs.readFileSync(`${folder}/contract.js`, 'utf8');
    const stateFromFile = JSON.parse(
      fs.readFileSync(`${folder}/initial-state.json`, 'utf8')
    );

    const initialState = {
      ...stateFromFile,
      ...{
        owner: process.env.WALLET_ADDRESS,
        claimable: [
          {
            to: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            from: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 10000,
            txID: '<tx1>',
          },
          {
            to: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            from: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '<tx2>',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: 'tT0FtnWOqLa8i0O5KvTISPPVkuQ85nCKZyViWurfIsk',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '_20HX5leIjjgR3V9OZp7ZZToY3GCOMl88ypvEwns8_o',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '3G63JMOJOzXGAJWhbTon7Q0lzcfEk7ltvhHFqzciAh4',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '1j6s_RKmxus6xz2zQQOwCeeUERASCxZZjSSrQvlzNic',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: 'sA4OIInIDufIFOwy4naKLq_pFe0lRXXYjcxKFBDUMwA',
          },
        ],
      },
    };

    const deployed = await warp.deploy({
      wallet: wallet1.jwk,
      initState: JSON.stringify({
        ...initialState,
      }),
      evaluationManifest: {
        evaluationOptions: {
          // sourceType: SourceType.WARP_SEQUENCER,
          internalWrites: true,
          // allowBigInt: true,
          unsafeClient: 'skip',
        },
      },
      src: contractSrc,
    });
    console.log('\x1b[32m', `contractTxId ${deployed.contractTxId}`);

    // execSync(
    //   `(cd ../app && npm i && VITE_CONTRACT=${deployed.contractTxId} VITE_LOCAL=true npm run dev)`,
    //   {
    //     encoding: 'utf8',
    //     stdio: 'inherit',
    //   }
    // );
  } catch (e) {
    console.log('ERROR', e);
    console.error(
      'Could not deploy contracts. Make sure arlocal is running (npx arlocal)'
    );
  }
}
deploy(process.argv[2]);
