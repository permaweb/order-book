const U = "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw";

export const CreateOrder = async (state, action) => {
  const caller = action.caller;
  const input = action.input;

  const pairs = state.pairs;
  const usedPair = input.pair;
  const qty = input.qty;
  const price = input.price;
  let tokenTx = input.transaction;
  let balances = state.balances;

  // test that pairs are valid contract strings
  ContractAssert(
    isAddress(usedPair[0]) && isAddress(usedPair[1]),
    "One of two supplied pair tokens is invalid"
  );

  // validate price is a number
  if (price) {
    ContractAssert(typeof price === "number", "Price must be a number");

    // validate price for limit orders
    ContractAssert(
      price === undefined || price === null || price > 0,
      "Price must be greater than 0"
    );
  }

  if (!Number.isInteger(qty) || qty === undefined) {
    throw new ContractError("Invalid value for quantity. Must be an integer.");
  }

  // ID of the transferred token is always first in pair
  let contractID = usedPair[0];

  if (contractID === SmartWeave.contract.id) {
    // Set the tokenTx to be internal
    tokenTx = "INTERNAL_TRANSFER";

    // Transfer assets to the contract
    if (qty <= 0 || caller === SmartWeave.contract.id) {
      throw new ContractError("Invalid token transfer.");
    }
    if (balances[caller] < qty) {
      throw new ContractError(
        "Caller balance not high enough to send " + qty + " token(s)."
      );
    }

    balances[caller] -= qty;
    if (SmartWeave.contract.id in balances) {
      balances[SmartWeave.contract.id] += qty;
    } else {
      balances[SmartWeave.contract.id] = qty;
    }
  } else if (
    usedPair[1] === SmartWeave.contract.id &&
    tokenTx === "INTERNAL_TRANSFER"
  ) {
    // do nothing
  } else {
    if (tokenTx === undefined || tokenTx === null) {
      throw new ContractError(
        "No token transaction provided given the token in the order is from a different contract"
      );
    }
    // Claim tokens from other contract
    await claimBalance(contractID, tokenTx, qty);
  }

  /**
   * Refund the order, if it is invalid
   */
  const refundTransfer = async () => {
    if (contractID === SmartWeave.contract.id) {
      // No need to make a foreign call because the token is governed by this contract
      balances[SmartWeave.contract.id] -= qty;
      if (caller in balances) {
        balances[caller] += qty;
      } else {
        balances[caller] = qty;
      }
    } else {
      // @ts-expect-error
      const result = await SmartWeave.contracts.write(contractID, {
        function: "transfer",
        target: caller,
        qty,
      });

      // Check that it succeeded
      if (result.type !== "ok") {
        throw new ContractError(
          `Unable to return order with txID: ${SmartWeave.transaction.id}`
        );
      }
    }
  };

  let pairIndex = -1;
  // find the pair index
  for (let i = 0; i < pairs.length; i++) {
    if (
      (pairs[i].pair[0] === usedPair[0] && pairs[i].pair[1] === usedPair[1]) ||
      (pairs[i].pair[0] === usedPair[1] && pairs[i].pair[1] === usedPair[0])
    ) {
      pairIndex = i;
    }
  }

  // test if the pair already exists
  if (pairIndex === -1) {
    // send back the funds
    await refundTransfer();

    // return state with the refund foreign call
    // and the error message
    return {
      state,
      result: {
        status: "failure",
        message: "This pair does not exist yet",
      },
    };
  }

  // Sort orderbook based on prices
  let sortedOrderbook;
  if (state.pairs[pairIndex].orders.length > 0) {
    sortedOrderbook = state.pairs[pairIndex].orders.sort((a, b) =>
      a.price > b.price ? 1 : -1
    );
  } else {
    sortedOrderbook = [];
  }

  // get the dominant token from the pair
  // it should always be the first one
  const dominantToken = state.pairs[pairIndex].pair[0];

  try {
    // try invoking the match function
    const { orderbook, foreignCalls, matches } = matchOrder(
      {
        pair: {
          dominant: dominantToken,
          from: contractID,
          to: usedPair.find((val) => val !== contractID),
        },
        quantity: qty,
        creator: caller,
        transaction: SmartWeave.transaction.id,
        transfer: tokenTx,
        price,
      },
      sortedOrderbook
    );
    // Update orderbook accordingly
    state.pairs[pairIndex].orders = orderbook;

    // calculate latest price and push logs
    // if the order had matches
    if (matches.length > 0) {
      // volume weighted average price
      // how it is calculated:
      // (volume_1 * price_1) + (volume_2 * price_2) + ...
      // divided by
      // volume_1 + volume_2 + ...
      const vwap =
        matches
          .map(({ qty: volume, price }) => volume * price)
          .reduce((a, b) => a + b, 0) /
        matches.map(({ qty: volume }) => volume).reduce((a, b) => a + b, 0);

      // update the latest price data
      state.pairs[pairIndex].priceData = {
        dominantToken,
        block: SmartWeave.block.height,
        vwap,
        matchLogs: matches,
      };
    } else {
      // if no matches, set the latest price data to empty
      state.pairs[pairIndex].priceData = undefined;
    }


    // Update foreignCalls accordingly for tokens to be sent
    for (let i = 0; i < foreignCalls.length; i++) {
      // Skip making zero balance transfers
      if (foreignCalls[i].input.qty <= 0) {
        continue;
      }
      if (foreignCalls[i].contract === SmartWeave.contract.id) {
        // No need to make a foreign call because the token is governed by this contract
        balances[SmartWeave.contract.id] -= foreignCalls[i].input.qty;
        if (foreignCalls[i].input.target in balances) {
          balances[foreignCalls[i].input.target] += foreignCalls[i].input.qty;
        } else {
          balances[foreignCalls[i].input.target] = foreignCalls[i].input.qty;
        }
      } else {
        // console.log({
        //   contract: foreignCalls[i].contract,
        //   input: foreignCalls[i].input
        // })
        // @ts-expect-error
        const result = await SmartWeave.contracts.write(
          foreignCalls[i].contract,
          foreignCalls[i].input
        );

        // Check that it succeeded
        if (result.type !== "ok") {
          throw new ContractError(
            `Unable to fill order with txID: ${foreignCalls[i].txID}`
          );
        }
      }
    }

    if (state.balances) {
      state.balances = balances;
    }

    return {
      state,
      result: {
        status: "success",
        message: "Order created successfully",
      },
    };
  } catch (e) {
    // if the match function throws an error, refund the transfer
    await refundTransfer();

    // return state with the refund foreign call
    // and the error message
    return {
      state,
      result: {
        status: "failure",
        message: e.message,
      },
    };
  }
};

export default function matchOrder(input, orderbook) {
  const orderType = input.price ? "limit" : "market";
  const foreignCalls = [];
  const matches = [];

  // orders that are made in the *reverse* direction as the current one
  // this order can match with the reverse orders only
  const reverseOrders = orderbook.filter(
    (order) => input.pair.from !== order.token && order.id !== input.transaction
  );

  // if there are no orders against the token we are buying, we only push it
  // but first, we check if it is a limit order
  if (!reverseOrders.length) {
    // ensure that the first order is a limit order
    if (orderType !== "limit")
      throw new Error('The first order for a pair can only be a "limit" order');

    // push to the orderbook
    orderbook.push({
      id: input.transaction,
      transfer: input.transfer,
      creator: input.creator,
      token: input.pair.from,
      price: input.price,
      quantity: Math.round(input.quantity),
      originalQuantity: input.quantity,
    });

    return {
      orderbook,
      foreignCalls,
      matches,
    };
  }

  // the total amount of tokens the user would receive
  // if the order type is "market", this changes
  // for each order in the orderbook
  // if it is a "limit" order, this will always
  // be the same
  let fillAmount;

  // the total amount of tokens the user of
  // the input order will receive
  let receiveAmount = 0;

  // the remaining tokens to be matched with an order
  let remainingQuantity = input.quantity;

  // loop through orders against this order
  for (let i = 0; i < orderbook.length; i++) {
    const currentOrder = orderbook[i];

    // only loop orders that are against this order
    if (
      input.pair.from === currentOrder.token ||
      currentOrder.id === input.transaction
    )
      continue;

    // price of the current order reversed to the input token
    const reversePrice = 1 / currentOrder.price;

    // continue if the current order's price matches
    // the input order's price (if the order is a limit order)
    if (orderType === "limit" && input.price !== reversePrice) continue;

    // set the total amount of tokens we would receive
    // from this order
    fillAmount = remainingQuantity * (input.price ?? reversePrice);

    // the input order creator receives this much
    // of the tokens from the current order
    let receiveFromCurrent = 0;

    // the input order is going to be completely filled
    if (fillAmount <= currentOrder.quantity) {
      // calculate receive amount
      receiveFromCurrent = remainingQuantity * reversePrice;

      // reduce the current order in the loop
      currentOrder.quantity -= fillAmount;

      // fill the remaining tokens
      receiveAmount += receiveFromCurrent;

      // send tokens to the current order's creator
      if (remainingQuantity > 0) {
        foreignCalls.push({
          txID: SmartWeave.transaction.id,
          contract: input.pair.from,
          input: {
            function: "transfer",
            target: currentOrder.creator,
            qty:
              input.pair.from === U
                ? Math.round(remainingQuantity * 0.995)
                : remainingQuantity,
          },
        });

        // send fee
        // foreignCalls.push({
        //   txID: SmartWeave.transaction.id,
        //   contract: input.pair.from,
        //   input: {
        //     function: "transfer",
        //     target: SmartWeave.contract.id,
        //     qty: Math.round(remainingQuantity * 0.005),
        //   },
        // });
      }

      // no tokens left in the input order to be matched
      remainingQuantity = 0;
    } else {
      // the input order is going to be partially filled
      // but the current order will be

      // calculate receive amount
      receiveFromCurrent = currentOrder.quantity;

      // add all the tokens from the current order to fill up
      // the input order
      receiveAmount += receiveFromCurrent;

      // the amount the current order creator will receive
      const sendAmount = receiveFromCurrent * currentOrder.price;

      // reduce the remaining tokens to be matched
      // by the amount the user is going to receive
      // from this order
      remainingQuantity -= sendAmount;

      // send tokens to the current order's creator
      foreignCalls.push({
        txID: SmartWeave.transaction.id,
        contract: input.pair.from,
        input: {
          function: "transfer",
          target: currentOrder.creator,
          qty:
            input.pair.from === U
              ? Math.round(remainingQuantity * 0.995)
              : remainingQuantity,
        },
      });

      // send fee
      // foreignCalls.push({
      //   txID: SmartWeave.transaction.id,
      //   contract: input.pair.from,
      //   input: {
      //     function: "transfer",
      //     target: feeWallet,
      //     qty: Math.round(sendAmount * 0.02),
      //   },
      // });

      // no tokens left in the current order to be matched
      currentOrder.quantity = 0;
    }

    // calculate dominant token price
    let dominantPrice = 0;

    if (input.pair.dominant === input.pair.from) {
      dominantPrice = input.price ?? reversePrice;
    } else {
      dominantPrice = currentOrder.price;
    }

    // push the match
    matches.push({
      id: currentOrder.id,
      qty: receiveFromCurrent,
      price: dominantPrice,
    });

    // if the current order is completely filled,
    // remove it from the orderbook
    if (currentOrder.quantity === 0) {
      orderbook = orderbook.filter((val) => val.id !== currentOrder.id);
    }

    // if there are no more tokens to be matched,
    // we can break the loop
    if (remainingQuantity === 0) break;
  }

  if (remainingQuantity > 0) {
    // if the input order is not completely filled,
    // and it is a limit order, push it to the orderbook
    if (orderType === "limit") {
      orderbook.push({
        id: input.transaction,
        transfer: input.transfer,
        creator: input.creator,
        token: input.pair.from,
        price: input.price,
        quantity: Math.round(remainingQuantity),
        originalQuantity: input.quantity,
      });
    } else {
      // if the input order is not completely filled,
      // and it is a market order, we return the funds
      foreignCalls.push({
        txID: SmartWeave.transaction.id,
        contract: input.pair.from,
        input: {
          function: "transfer",
          target: input.creator,
          qty: remainingQuantity,
        },
      });
    }
  }

  // send tokens to the input order's creator
  foreignCalls.push({
    txID: SmartWeave.transaction.id,
    contract: input.pair.to,
    input: {
      function: "transfer",
      target: input.creator,
      qty:
        input.pair.to === U ? Math.round(receiveAmount * 0.995) : receiveAmount,
    },
  });

  // send fee
  // foreignCalls.push({
  //   txID: SmartWeave.transaction.id,
  //   contract: input.pair.to,
  //   input: {
  //     function: "transfer",
  //     target: feeWallet,
  //     qty: Math.round(receiveAmount * 0.02),
  //   },
  // });

  return {
    orderbook,
    foreignCalls,
    matches,
  };
}

//const feeWallet = "SMft-XozLyxl0ztM-gPSYKvlZVCBiiftNIb4kGFI7wg";

/**
 * Use Warp internalWrite to call the `claim` function of contract
 * @param tokenID Contract ID of token to interact with
 * @param transferTx Transaction of claim
 * @param qty Quantity of tokens being claimed
 */
const claimBalance = async (tokenID, transferTx, qty) => {
  // @ts-expect-error
  const result = await SmartWeave.contracts.write(tokenID, {
    function: "claim",
    txID: transferTx,
    qty,
  });
  // Check that it succeeded
  if (result.type !== "ok") {
    throw new ContractError(`Unable to make claim with txID: ${transferTx}`);
  }
};

/**
 * Returns if a string is a valid Arweave address or ID
 *
 * @param addr String to validate
 *
 * @returns Valid address or not
 */
export const isAddress = (addr) => /[a-z0-9_-]{43}/i.test(addr);

/**
 * Get the transaction id of this contract.
 *
 * @returns The CLOB contract ID
 */
function getContractID() {
  const tags = tagPatch(SmartWeave.transaction.tags);
  const id = tags.find(({ name }) => name === "Contract").value;

  return id;
}
