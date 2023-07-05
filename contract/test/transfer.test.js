import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

globalThis.SmartWeave = {
  block: {
    height: 1209000,
  },
};

test("transfer", async () => {
  const { handle } = await import("../src/index.js");
  const result = await handle(
    {
      U: "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw",
      recentRewards: {},
      lastReward: 0,
      streaks: {},
      balances: {
        bacjdyljxfrovwffuszkbacwispcaegwgtfrxwuidwe: 200,
      },
      name: "BazAR",
      ticker: "BazAR",
      pairs: [],
      claimable: [],
    },
    {
      caller: "bacjdyljxfrovwffuszkbacwispcaegwgtfrxwuidwe",
      input: {
        function: "transfer",
        target: "wszkkrsxsdmiygqdlzhczxdnhxngtqwnhtabkwkhyli",
        qty: 100,
      },
    }
  );

  assert.equal(
    result.state.balances["wszkkrsxsdmiygqdlzhczxdnhxngtqwnhtabkwkhyli"],
    100
  );
  assert.equal(
    result.state.balances["bacjdyljxfrovwffuszkbacwispcaegwgtfrxwuidwe"],
    100
  );
  assert.ok(true);
});

test.run();
