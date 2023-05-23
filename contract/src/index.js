import { addPair } from "./write/add-pair.js";
import { createOrder } from "./write/create-order.js";

export async function handle(state, action) {
  switch (action?.input?.function) {
    case "addPair":
      return addPair(state, action).fold(handleError, handleSuccess);
    case "createOrder":
      return createOrder(env)(state, action).toPromise();
    default:
      throw new ContractError("No Function Found");
  }
}

function handleError(msg) {
  throw new ContractError(msg);
}

function handleSuccess(result) {
  return result;
}
