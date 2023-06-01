import { test } from "uvu";
import * as assert from "uvu/assert";
import fs from "fs";
import { WarpFactory } from "warp-contracts";

const jwk = JSON.parse(fs.readFileSync("../wallet.json", "utf-8"));
const jwk2 = JSON.parse(fs.readFileSync("../wallet2.json", "utf-8"));

const warp = WarpFactory.forMainnet();
const options = {
  allowBigInt: true,
  //remoteStateSyncEnabled: true,
  internalWrites: true,
  unsafeClient: "skip",
};

test.skip("ok", async () => {
  const write = createWrite(jwk);
  const write2 = createWrite(jwk2);
  const U = "IH-NaCRpqneQJVTXKQfvYHd07RJ5zYhebU4UuBv_Dcs";
  const S = "v2_K0CmW3V-5jubazkXjCo4AGUvlft4vi203t8zfcXw";
  const BOOK = "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8";

  const QTY = 5000;
  const PRICE = 1;

  console.log(await read(S).then((r) => r.cachedValue.state));
  console.log(await read(U).then((r) => r.cachedValue.state));
  return;
  //console.log(await read(BOOK).then(r => JSON.stringify(r.cachedValue.state, null, 2)))
  // return

  // add pair
  // const { pairs } = await read(BOOK).then(r => r.cachedValue.state)
  // if (!pairs.find(p => p[0] === S && p[1] === U)) {
  //await write(BOOK, { function: 'addPair', pair: [S, U] })
  // }
  // do Sell
  const sellTx = await write(S, {
    function: "allow",
    target: BOOK,
    qty: QTY,
  }).then((r) => r.originalTxId);
  await write(BOOK, {
    function: "createOrder",
    pair: [S, U],
    transaction: sellTx,
    qty: QTY,
    price: PRICE,
  });
  // do Buy
  const buyTx = await write2(U, {
    function: "allow",
    target: BOOK,
    qty: QTY,
  }).then((r) => r.originalTxId);
  await write2(BOOK, {
    function: "createOrder",
    pair: [U, S],
    transaction: buyTx,
    qty: QTY,
  });

  // fin
  assert.ok(true);
});

test.run();

function read(id) {
  return warp.contract(id).setEvaluationOptions(options).readState();
}

function createWrite(jwk) {
  return (contract, input) => {
    return warp
      .contract(contract)
      .connect(jwk)
      .setEvaluationOptions(options)
      .writeInteraction(input);
  };
}
