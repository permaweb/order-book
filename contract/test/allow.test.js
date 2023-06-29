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
    height: 100
  },
  transaction: {
    id: "utqalrlppwmohjsbnzsptudhwacrtvxkvuhaopboioo",
  },
};

test("allow should create a claimable record", async () => {
  const { handle } = await import("../src/index.js");
  const result = await handle(
    {
      streaks: {},
      name: "Token",
      ticker: "Token",
      balances: { qgdmaozpkycnvisvjfcbglxfvovejncdrvjgctzbhvs: 200 },
      claimable: [],
      pairs: [],
      recentRewards: {},
      lastReward: 0
    },
    {
      caller: "qgdmaozpkycnvisvjfcbglxfvovejncdrvjgctzbhvs",
      input: {
        function: "allow",
        target: "sbqtsdcngxppybtjrlxmpgjoqpymyeddwfcyrmyvfue",
        qty: 100,
      },
    }
  );

  assert.equal(result.state.claimable[0].qty, 100);
  assert.ok(true);
});

test.run();
