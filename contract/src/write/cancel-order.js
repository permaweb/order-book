export const CancelOrder = async (state, action) => {
  const caller = action.caller;
  const input = action.input;

  const orderTxID = input.orderID;

  // Verify order ID
  ContractAssert(isAddress(orderTxID), "Invalid order ID");

  // Remap all orders into one array
  const allOrders = state.pairs.map((pair) => pair.orders).flat(1);

  // Get the order to cancel
  const order = allOrders.find(({ id }) => id === orderTxID);

  // Ensure that the order exists
  ContractAssert(order !== undefined, "Order does not exist");

  // Ensure that the creator of the order is the caller
  ContractAssert(
    order.creator === caller,
    "Caller is not the creator of the order"
  );

  // Send back the *not* filled tokens to the creator of the order
  if (order.token === SmartWeave.contract.id) {
    // No need to make a foreign call because the token is governed by this contract
    state.balances[SmartWeave.contract.id] -= order.quantity;
    if (caller in state.balances) {
      state.balances[caller] += order.quantity;
    } else {
      state.balances[caller] = order.quantity;
    }
  } else {
    // @ts-expect-error
    const result = await SmartWeave.contracts.write(order.token, {
      function: "transfer",
      target: caller,
      qty: order.quantity,
    });

    // Check that it succeeded
    if (result.type !== "ok") {
      throw new ContractError(
        `Unable to make claim with txID: ${SmartWeave.transaction.id}`
      );
    }
  }

  // The pair that the order belongs to
  const acitvePair = state.pairs.find((pair) =>
    pair.orders.find(({ id }) => id === orderTxID)
  );

  // Remove cancelled order
  acitvePair.orders = acitvePair.orders.filter(({ id }) => id !== orderTxID);

  return {
    state,
    result: {
      status: "success",
      message: "Order cancelled successfully",
    },
  };
};

/**
 * Returns if a string is a valid Arweave address or ID
 *
 * @param addr String to validate
 *
 * @returns Valid address or not
 */
export const isAddress = (addr) => /[a-z0-9_-]{43}/i.test(addr);
