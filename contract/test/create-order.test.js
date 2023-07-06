import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

test("create order with no limits but vwap set", async () => {
  const state = {
    U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
    recentRewards: {},
    lastReward: 0,
    streaks: {},
    pairs: [
      {
        pair: [
          "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
          "rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk",
        ],
        orders: [],
        pricedata: {
          block: 1207800,
          dominantToken: "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
          matchLogs: [
            {
              id: "PbZeNcn8dNu_TzCC4rmYAsE-z5XUtqCMgPW8EsJuEbk",
              price: 1000,
              qty: 1,
            },
          ],
          vwap: 1000,
        },
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
      pair: [
        "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
        "rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk",
      ],
      qty: 100,
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
    transaction: {
      id: "oeYUgBDGBql5-ik4DJ5cDvacwmYe03jx6A5pQK7DEBw",
    },
    contract: {
      id: "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8",
    },
    contracts: {
      readContractState: () => Promise.resolve({ balances: {} }),
      write: (id, input) => Promise.resolve({ type: "ok" }),
    },
    block: {
      height: 1209000,
    },
  };
  const { handle } = await import("../src/index.js");
  const response = await handle(state, action);

  assert.equal(
    response.result.message,
    'The first order for a pair can only be a "limit" order'
  );
  assert.equal(response.result.status, "failure");
  assert.ok(true);
});

test.run();
