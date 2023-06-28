import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

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
