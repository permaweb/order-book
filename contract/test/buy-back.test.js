import { test } from 'uvu'
import * as assert from 'uvu/assert'

// buy backs is the process that the contract takes collected fees from the previous interaction and
// creates an sell order for $zAR. Burns the $zAR by setting its balance to zero
const EYEBLOB_43 = 'yfViHER2NCT7lEeR4nWKxG64ar3fKxagTP0OMfZLJmM'
const U = 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw'
globalThis.SmartWeave = {
  contract: {
    id: 'AHrcXuowqLwX-EzPhks-Hla3BY7gPMc9XpYDi2sHSCI'
  },
  contracts: {
    readContractState(id) {
      if (id === U) {
        return Promise.resolve({
          balances: {
            [U]: 1000
          }
        })
      }
      return Promise.resolve({})
    }
  }
}

test('buyback ', async () => {
  const state = {
    balances: {

    },
    pairs: [{
      pair: []
    }],
    claimable: [],
    name: "BazAR",
    ticker: "zAR"
  }

  const { buyBack } = await import('../src/cron/buyback.js')
  const result = await buyBack(state)
  assert.ok(true)
})

test.run()