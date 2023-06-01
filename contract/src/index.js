import { addPair } from "./write/add-pair.js";
import { CreateOrder } from "./write/create-order.js";
import { CancelOrder } from "@verto/flex";

export async function handle(state, action) {
  switch (action?.input?.function) {
    case "addPair":
      return addPair(state, action).extract();
    case "createOrder":
      return CreateOrder(state, action);
    case "cancelOrder":
      return CancelOrder(state, action);
    default:
      throw new ContractError("No Function Found");
  }
}
