import { test } from "uvu";
import * as assert from "uvu/assert";

test("addPair", async () => {
  globalThis.ContractAssert = (expr, msg) => {
    if (!expr) {
      throw new Error(msg);
    }
  };
  globalThis.SmartWeave = {
    block: {
      height: 100,
    },
  };
  const state = {
    U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
    streaks: {},
    pairs: [],
    balances: {},
    name: "BazAR",
    ticker: "BazAR",
    claimable: [],
    recentRewards: {},
    lastReward: 0,
  };
  const action = {
    caller: createKey("A"),
    input: {
      function: "addPair",
      pair: [createKey("B"), createKey("C")],
    },
  };

  const { handle } = await import("../src/index.js");
  const result = await handle(state, action);

  assert.equal(result.state.pairs[0], {
    pair: [createKey("B"), createKey("C")],
    orders: [],
  });
  assert.ok(true);
});

test.run();

function createKey(a) {
  let result = "";
  for (var i = 0; i < 43; i++) {
    result += a;
  }
  return result;
}
