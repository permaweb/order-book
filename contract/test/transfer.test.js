import { test } from "uvu";
import * as assert from "uvu/assert";

globalThis.ContractAssert = function (expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};

test("transfer", async () => {
  const { handle } = await import("../src/index.js");
  const result = await handle(
    {
      balances: {
        bacjdyljxfrovwffuszkbacwispcaegwgtfrxwuidwe: 200,
      },
      name: "BazAR",
      ticker: "BazAR",
      pairs: [],
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
