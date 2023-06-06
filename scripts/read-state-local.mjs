import { WarpFactory } from 'warp-contracts/mjs';
import fs from 'fs';

async function read(contractId) {
  if (!process.argv[2]) {
    console.error(
      '\x1b[31m',
      'Please pass a contract id to this script. eg. npm run read-state-local -- jDfNfhPEL3PrNC1WAU_CuwUutfszamV-3S0ClFaxd1c'
    );
    process.exit(1);
  }
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forLocal();
  const connected = warp
    .contract(contractId)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  const state = (await connected.readState()).cachedValue.state;
  console.log('State', JSON.stringify(state));
}
read(process.argv[2]).catch(console.log);
