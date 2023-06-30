import { test } from "uvu";
import * as assert from "uvu/assert";

const U = "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

test("sell order", async () => {
  const state = {
    U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
    recentRewards: {},
    lastReward: 0,
    streaks: {},
    pairs: [
      {
        pair: ["cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8", U],
        orders: [],
        pricedata: {},
      },
    ],
    balances: {},
    name: "BazAR",
    ticker: "BazAR",
  };

  const action = {
    caller: "jnbRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
    input: {
      function: "createOrder",
      pair: ["cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8", U],
      qty: 100,
      price: 100,
      transaction: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
    },
  };

  globalThis.ContractAssert = function (exp, msg) {
    return exp ? null : new Error(msg);
  };

  globalThis.ContractError = function (msg) {
    return new Error(msg);
  };

  globalThis.SmartWeave = {
    block: {
      height: 1209775,
    },
    transaction: {
      id: "oeYUgBDGBql5-ik4DJ5cDvacwmYe03jx6A5pQK7DEBw",
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
        //console.log(input);
        if (id === U) {
          assert.equal(input.qty, 995);
        }
        return Promise.resolve({ type: "ok" });
      },
    },
  };
  const { handle } = await import("../src/index.js");
  const response = await handle(state, action);

  //console.log(JSON.stringify(response.state, null, 2));
  assert.equal(response.state.pairs[0].orders[0].price, 100);
  assert.equal(response.state.pairs[0].orders[0].quantity, 100);
  assert.equal(response.result.status, "success");
  assert.ok(true);
});

test.run();
