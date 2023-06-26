import { test } from "uvu";
import * as assert from "uvu/assert";

test("buy order", async () => {
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
      write: (id, input) => Promise.resolve({ type: "ok" }),
    },
  };

  const { handle } = await import("../src/index.js");
  const state = {
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
            id: "xkKyDgsr360TVgy07XwbWOuWXUD2WdXil_Npk8wx8Qg",
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
  };

  const action = {
    caller: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
    input: {
      function: "createOrder",
      pair: [
        "rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk",
        "cJLpXX2StsvkdPbIHJp2TuTIpdDBRTWouD6o1Ig9-S8",
      ],
      qty: 10000,
      transaction: "MsflN4glR9noV-DN00ygwKJZmCQS1S1ejbVRmQ5N_Nc",
    },
  };
  const response = await handle(state, action);

  //console.log(JSON.stringify(response, null, 2));
  //assert.equal(response.state.pairs[0].priceData.vwap, 100)
  assert.equal(response.result.status, "success");
  assert.ok(true);
});

test.run();
