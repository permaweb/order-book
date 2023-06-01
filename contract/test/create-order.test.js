import { test } from "uvu";
import * as assert from "uvu/assert";
import { WarpFactory } from "warp-contracts";
import fs from "fs";

const jwk = JSON.parse(fs.readFileSync("../wallet2.json", "utf-8"));
const warp = WarpFactory.forMainnet();

test.skip("ok", async () => {
  const result = await warp
    .contract("A95-Ois-sWAi_epwwcyV1JBsLzB1eIQh9Qegx1mLjA4")
    .connect(jwk)
    .setEvaluationOptions({
      allowBigInt: true,
      remoteStateSyncEnabled: true,
      unsafeClient: "skip",
      internalWrites: true,
    })
    //.writeInteraction({
    .dryWrite({
      function: "createOrder",
      pair: [
        "ZYpd0abOsX1CV_MujpklE-PTUtt7BM62ZWRMExJWe5M",
        "0Ml8QVtgoL8KNvBm0pmSWH48oaSRlSrG4FnuXXQbU-0",
      ],
      //price: 100,
      qty: 10000,
      transaction: "8LV5CMpEYiQ0QP7ZLdNCBXB8zQgqMgDglN2CPh12sV8",
    });

  console.log(result);
  assert.ok(true);
});

test.run();
