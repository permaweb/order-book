import { test } from "uvu";
import * as assert from "uvu/assert";

// buy backs is the process that the contract takes collected fees from the previous interaction and
// creates an sell order for $zAR. Burns the $zAR by setting its balance to zero
const EYEBLOB_43 = "yfViHER2NCT7lEeR4nWKxG64ar3fKxagTP0OMfZLJmM";
const U = "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw";
test("buyback ", async () => {
  globalThis.ContractAssert = function (expr, msg) {
    if (expr) {
      return null;
    } else {
      throw new Error(msg);
    }
  };

  globalThis.ContractError = function (msg) {
    return new Error(msg);
  };

  globalThis.SmartWeave = {
    block: {
      height: 100000,
    },
    transaction: {
      id: "W44dNBTBJAeNyb4Bo1IG1TI96VGLNah6m8sy9HUKu5Y",
    },
    contract: {
      id: "AHrcXuowqLwX-EzPhks-Hla3BY7gPMc9XpYDi2sHSCI",
    },
    contracts: {
      write(id, input) {
        //console.log(id, input);
        return Promise.resolve({ type: "ok" });
      },
      readContractState(id) {
        if (id === U) {
          return Promise.resolve({
            balances: {
              "AHrcXuowqLwX-EzPhks-Hla3BY7gPMc9XpYDi2sHSCI": 10000,
            },
          });
        }
        //console.log('readState', id)
        return Promise.resolve({});
      },
    },
  };
  const state = {
    U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
    balances: {},
    pairs: [
      {
        pair: [globalThis.SmartWeave.contract.id, U],
        orders: [
          {
            id: "xkKyDgsr360TVgy07XwbWOuWXUD2WdXil_Npk8wx8Qg",
            transfer: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
            creator: "jnbRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
            token: globalThis.SmartWeave.contract.id,
            price: 100,
            quantity: 100,
            originalQuantity: 100,
          },
        ],
        priceData: {},
      },
    ],
    claimable: [],
    name: "BazAR",
    ticker: "zAR",
    recentRewards: {},
    lastReward: 0,
  };

  const { buyback } = await import("../src/cron/buyback.js");
  const response = await buyback(state);
  //console.log(JSON.stringify(response, null, 2));
  assert.equal(response.pairs[0].priceData.vwap, 100);
  assert.ok(true);
});

test.run();
