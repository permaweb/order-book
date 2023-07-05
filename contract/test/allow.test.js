import { test } from "uvu";
import * as assert from "uvu/assert";

test("allow should create a claimable record", async () => {
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
    transaction: {
      id: "utqalrlppwmohjsbnzsptudhwacrtvxkvuhaopboioo",
    },
  };

  const { handle } = await import("../src/index.js");
  const result = await handle(
    {
      U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
      streaks: {},
      name: "Token",
      ticker: "Token",
      balances: { qgdmaozpkycnvisvjfcbglxfvovejncdrvjgctzbhvs: 200 },
      claimable: [],
      pairs: [],
      recentRewards: {},
      lastReward: 0,
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
