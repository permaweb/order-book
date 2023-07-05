import { addPair } from "./write/add-pair.js";
import { CreateOrder } from "./write/create-order.js";
import { CancelOrder } from "./write/cancel-order.js";
import { balance } from "./read/balance.js";
import { transfer } from "./write/transfer.js";
import { validate } from "./read/validate.js";
import { allow } from "./write/allow.js";
import { claim } from "./write/claim.js";
import { buyback } from "./cron/buyback.js";
import { reward } from "./cron/reward.js";
import { cancelClaim } from './write/cancel-claim.js';

export async function handle(state, action) {
  validate(state);
  state = reward(state);
  // do buyback
  if (action.input.function === "createOrder") {
    state = await buyback(state);
  }
  switch (action?.input?.function) {
    case "noop":
      return { state };
    case "addPair":
      return addPair(state, action).extract();
    case "createOrder":
      return CreateOrder(state, action);
    case "cancelOrder":
      return CancelOrder(state, action);
    case "cancelClaim":
      return cancelClaim(state, action);
    case "balance":
      return balance(state, action);
    case "transfer":
      return transfer(state, action).fold(handleError, (result) => result);
    case "allow":
      return allow(state, action).fold(handleError, (result) => result);
    case "claim":
      return claim(state, action).fold(handleError, (result) => result);
    default:
      throw new ContractError("No Function Found");
  }
}

function handleError(msg) {
  throw new ContractError(msg);
}
