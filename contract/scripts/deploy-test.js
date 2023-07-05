//FYJOKdtNKl18QgblxgLEZUfJMFUv6tZTQqGTtY-D6jQ
import { SourceType, WarpFactory } from 'warp-contracts'
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy'
import fs from 'fs'

const jwk = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))
const src = fs.readFileSync('./dist/index.js', 'utf-8')
const warp = WarpFactory.forMainnet().use(new DeployPlugin())
//const initState = fs.readFileSync('./full-state.json', 'utf-8')

async function main() {
  const result = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    src,
    initState: JSON.stringify({
      pairs: [],
      name: "zAR",
      ticker: 'zAR',
      balances: {},
      claimable: [],
      lastReward: 0,
      streaks: {},
      settings: [
        ['isTradeable', true],
        ['website', 'https://zAR-wiki.arweave.dev']
      ],
      U: 'FYJOKdtNKl18QgblxgLEZUfJMFUv6tZTQqGTtY-D6jQ',
      recentRewards: {},
      mode: 'test'
    }),
    //initState,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        allowBigInt: true,
        internalWrites: true,
        unsafeClient: 'skip'
      }
    }
  })
  console.log(result)
}

main()