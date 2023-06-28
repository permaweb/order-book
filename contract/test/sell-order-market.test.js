import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

test("market sell order", async () => {
  const state = {
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
            id: "S004FI6ADFWNedH-NwUc08dnlxqTDruJLenpfORbj0g",
            transfer: "MsflN4glR9noV-DN00ygwKJZmCQS1S1ejbVRmQ5N_Nc",
            creator: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
            token: "rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk",
            price: 0.01,
            quantity: 1000,
            originalQuantity: 1000,
          },
        ],
        pricedata: {},
      },
    ],
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
      write: (id, input) => Promise.resolve({ type: "ok" }),
    },
    block: {
      height: 10000000,
    },
  };
  const { handle } = await import("../src/index.js");
  const response = await handle(state, action);

  //console.log(JSON.stringify(response.state, null, 2))
  //console.log(JSON.stringify(response.result, null, 2))
  // assert.equal(response.state.pairs[0].orders[0].price, 100);
  // assert.equal(response.state.pairs[0].orders[0].quantity, 100);
  assert.equal(response.result.status, "success");
  assert.ok(true);
});

test.run();
