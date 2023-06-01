const feeWallet = "1234";

export function matchOrder(input, orderbook) {
  const orderType = input.price ? "limit" : "market";
  const foreignCalls = [];
  const matches = [];

  /* remove input from orderbook */
  const reverseOrders = orderbook.filter(
    (order) => input.pair.from !== order.token && order.id !== input.transaction
  );

  if (!reverseOrders.length) {
    if (orderType !== "limit") {
      throw new Error("The first order fro a pair can only be a 'limit' order");
    }

    orderbook.push({
      id: input.transaction,
      transfer: input.transfer,
      creator: input.creator,
      token: input.pair.from,
      price: input.price,
      quantity: Math.round(input.quantity),
      originalQuantity: input.quantity,
    });

    console.log({ orderbook });

    return {
      orderbook,
      foreignCalls,
      matches,
    };
  }

  let fillAmount;
  let receiveAmount = 0;
  let remainingQuantity = input.quantity;

  for (let i = 0; i < orderbook.length; i++) {
    const currentOrder = orderbook[i];
    if (
      input.pair.from === currentOrder.token ||
      currentOrder.id === input.transaction
    ) {
      continue;
    }

    const reversePrice = 1 / currentOrder.price;

    if (orderType === "limit" && input.price !== reversePrice) {
      continue;
    }

    fillAmount = remainingQuantity * (input.price ?? reversePrice);
    let receiveFromCurrent = 0;

    if (fillAmount <= currentOrder.quantity) {
      receiveFromCurrent = remainingQuantity * reversePrice;
      currentOrder.quantity -= fillAmount;
      receiveAmount += receiveFromCurrent;

      if (remainingQuantity > 0) {
        foreignCalls.push({
          txID: SmartWeave.transaction.id,
          contract: input.pair.from,
          input: {
            function: "transfer",
            target: currentOrder.creator,
            qty: Math.round(remainingQuantity * 0.98),
          },
        });

        // fee
        foreignCalls.push({
          txID: SmartWeave.transaction.id,
          contract: input.pair.from,
          input: {
            function: "transfer",
            target: feeWallet,
            qty: Math.round(remainingQuantity * 0.02),
          },
        });
      }
      remainingQuantity = 0;
    } else {
      receiveFromCurrent = currentOrder.quantity;
      receiveAmount += receiveFromCurrent;
      const sendAmount = receiveFromCurrent * currentOrder.price;
      remainingQuantity -= sendAmount;

      foreignCalls.push({
        txID: SmartWeave.transaction.id,
        contract: input.pair.from,
        input: {
          function: "transfer",
          target: currentOrder.creator,
          qty: Math.round(sendAmount * 0.98),
        },
      });

      foreignCalls.push({
        txID: SmartWeave.transaction.id,
        contract: input.pair.from,
        input: {
          function: "transfer",
          target: feeWallet,
          qty: Math.round(sendAmount * 0.02),
        },
      });

      currentOrder.quantity = 0;
      let dominantPrice = 0;

      if (input.pair.dominant === input.pair.from) {
        dominantPrice = input.price ?? reversePrice;
      } else {
        dominantPrice = currentOrder.price;
      }

      matches.push({
        id: currentOrder.id,
        qty: receiveFromCurrent,
        price: dominantPrice,
      });

      if (currentOrder.quantity === 0) {
        orderbook = orderbook.filter((val) => val.id !== currentOrder.id);
      }

      if (remainingQuantity === 0) {
        break;
      }
    }

    if (remainingQuantity > 0) {
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
  }

  foreignCalls.push({
    txID: SmartWeave.transaction.id,
    contract: input.pair.to,
    input: {
      function: "transfer",
      target: input.creator,
      qty: Math.round(receiveAmount * 0.98),
    },
  });

  foreignCalls.push({
    txID: SmartWeave.transaction.id,
    contract: input.pair.to,
    input: {
      function: "transfer",
      target: feeWallet,
      qty: Math.round(receiveAmount * 0.02),
    },
  });

  return {
    orderbook,
    foreignCalls,
    matches,
  };
}
