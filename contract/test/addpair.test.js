import { test } from "uvu";
import * as assert from "uvu/assert";

import { handle } from "../src/index.js";

test("addPair", async () => {
  const state = {
    pairs: [],
    balances: {},
    name: "BazAR",
    ticker: "BazAR",
    claimable: [],
  };
  const action = {
    caller: createKey("A"),
    input: {
      function: "addPair",
      pair: [createKey("B"), createKey("C")],
    },
  };

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
