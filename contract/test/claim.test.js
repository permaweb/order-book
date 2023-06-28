import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

test("check claim function", async () => {
  const { handle } = await import("../src/index.js");
  const result = await handle(
    {
      streaks: {},
      name: "Token",
      ticker: "Token",
      balances: {},
      claimable: [
        {
          to: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
          qty: 100,
          txID: "wMg1QaLFRSolve7aXEl6aA1NlqX2BoJQecwIcu7GDBE",
        },
      ],
      pairs: [],
    },
    {
      caller: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
      input: {
        function: "claim",
        qty: 100,
        txID: "wMg1QaLFRSolve7aXEl6aA1NlqX2BoJQecwIcu7GDBE",
      },
    }
  );

  assert.equal(
    result.state.balances["9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4"],
    100
  );
  assert.ok(true);
});

test.run();
