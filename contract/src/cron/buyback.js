import { CreateOrder } from "../write/create-order.js";

// if there is one or more Sell Orders for the pair [zAR, U] and there is a balance of U for
// this contract then I want to purchase zAR and burn it.
const U = "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw";

export async function buyback(state) {
  const uState = await SmartWeave.contracts.readContractState(U);
  const uBalance = uState.balances[SmartWeave.contract.id] || 0;

  // validate
  if (uBalance === 0) {
    return state;
  }

  const zAR_U = state.pairs.find(
    (p) => p.pair.includes(U) && p.pair.includes(SmartWeave.contract.id)
  );

  if (!zAR_U) {
    state.pairs.push({
      pair: [SmartWeave.contract.id, U],
      orders: [],
      priceData: {},
    });
    return state;
  }

  if (zAR_U.orders.length === 0) {
    return state;
  }

  let uInventory = zAR_U.orders.reduce((a, o) => o.price * o.quantity + a, 0);
  let purchaseU = uInventory < uBalance ? uInventory : uBalance;

  // createOrder
  const response = await CreateOrder(state, {
    caller: SmartWeave.contract.id,
    input: {
      pair: [U, SmartWeave.contract.id],
      qty: purchaseU,
      transaction: "INTERNAL_TRANSFER",
    },
  });
  // burn zAR
  response.state.balances[SmartWeave.contract.id] = 0;
  if (response.result.status === "success") {
    return response.state;
  } else {
    return state;
  }
}

// match orders