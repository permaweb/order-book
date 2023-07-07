import { test } from "uvu";
import * as assert from "uvu/assert";

const U = "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw";

test("buy multi sell order", async () => {
  globalThis.ContractAssert = function (expr, msg) {
    if (!expr) {
      throw new Error(msg);
    }
  };

  globalThis.ContractError = function (msg) {
    return new Error(msg);
  };

  globalThis.SmartWeave = {
    block: {
      height: 10000000,
    },
    transaction: {
      id: "S004FI6ADFWNedH-NwUc08dnlxqTDruJLenpfORbj0g",
    },
    contract: {
      id: "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8",
    },
    contracts: {
      readContractState(id) {
        if (id === U) {
          return Promise.resolve({
            balances: {
              "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8": 0,
            },
          });
        }
        //console.log('readState', id)
        return Promise.resolve({});
      },
      write: (id, input) => {
        
        if (id === U && input.function === "transfer") {
          console.log(input)
          //console.log(input.qty)
        //   assert.equal(input.qty, 20000);
        }
        return Promise.resolve({ type: "ok" });
      },
    },
  };

  const { handle } = await import("../src/index.js");
  const state = {
    streaks: {},
    balances: {},
    name: "BazAR",
    ticker: "BazAR",
    U,
    pairs: [
      {
        pair: ["cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8", U],
        orders: [
          {
            id: "xkKyDgsr360TVgy07XwbWOuWXUD2WdXil_Npk8wx8Qg",
            transfer: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
            creator: "billhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
            token: "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
            price: 100,
            quantity: 100,
            originalQuantity: 100,
          },
          {
            id: "ikKyDgsr360TVgy07XwbWOuWXUD2WdXil_Npk8wx8Qg",
            transfer: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
            creator: "joeRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
            token: "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
            price: 100,
            quantity: 100,
            originalQuantity: 100,
          },
          {
            id: "zkKyDgsr360TVgy07XwbWOuWXUD2WdXil_Npk8wx8Qg",
            transfer: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
            creator: "robRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
            token: "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
            price: 100,
            quantity: 10,
            originalQuantity: 100,
          },
        ],
        priceData: {},
      },
    ],
    claimable: [],
    recentRewards: {},
    lastReward: 0,
  };

  const action = {
    caller: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
    input: {
      function: "createOrder",
      pair: [U, "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8"],
      qty: 13050,
      transaction: "MsflN4glR9noV-DN00ygwKJZmCQS1S1ejbVRmQ5N_Nc",
    },
  };
  const response = await handle(state, action);

  console.log(JSON.stringify(response, null, 2));
  //assert.equal(response.state.pairs[0].priceData.vwap, 100)
  assert.equal(response.result.status, "success");
  assert.ok(true);
});

test.run();
