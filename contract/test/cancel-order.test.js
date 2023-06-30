import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractError = function (msg) {
  return new Error(msg);
};
globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

globalThis.SmartWeave = {
  block: {
    height: 1209776,
  },
  contract: {
    id: "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8",
  },
  transaction: {
    id: "hRvK8wnYM5SWebYN66n_QmX9S9hXGlxujW8fUaH-kaY",
  },
  contracts: {
    write: (id, input) => Promise.resolve({ type: "ok" }),
  },
};
const state = {
  U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
  streaks: {},
  balances: {},
  name: "BazAR",
  ticker: "BazAR",
  pairs: [
    {
      pair: [
        "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
        "rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk",
      ],
      orders: [
        {
          id: "oeYUgBDGBql5-ik4DJ5cDvacwmYe03jx6A5pQK7DEBw",
          transfer: "_cgC5BGpH9A_HWIOd1FA0L1nxL0etq_xaOA7JxmK9f8",
          creator: "jnbRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
          token: "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
          price: 100,
          quantity: 100,
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

test("cancelOrder", async () => {
  const { handle } = await import("../src/index.js");
  const res = await handle(state, {
    caller: "jnbRhoH3JGTdRz0Y9X-gh-eosrbIpdxs58DPTtlOVE8",
    input: {
      function: "cancelOrder",
      orderID: "oeYUgBDGBql5-ik4DJ5cDvacwmYe03jx6A5pQK7DEBw",
    },
  });
  assert.equal(res.state.pairs[0].orders, []);
  assert.equal(res.result.status, "success");
  assert.ok(true);
});

test.run();
