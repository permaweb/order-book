import { of, Left, Right } from "../lib/either.js";

export const allow = (state, action) =>
  of({ state, action }).chain(validate).map(update);

function update({ state, action }) {
  state.balances[action.caller] -= action.input.qty;
  if (!state.claimable) {
    state.claimable = [];
  }
  state.claimable.push({
    from: action.caller,
    to: action.input.target,
    qty: action.input.qty,
    txID: SmartWeave.transaction.id,
  });
  return { state };
}

function validate({ state, action }) {
  if (!Number.isInteger(action.input.qty) || action.input.qty === undefined) {
    return Left("Invalid value for quantity. Must be an integer.");
  }
  if (!action?.input?.target) {
    return Left("No target specified.");
  }
  if (action.input.target.length !== 43) {
    return Left("Target is not valid!");
  }

  if (action.input.target === SmartWeave.transaction.id) {
    return Left("Cant setup claim to transfer a balance to itself");
  }
  if (action.caller === action.input.target) {
    return Left("Invalid balance transfer");
  }
  if (!state.balances[action.caller]) {
    return Left("Caller does not have a balance");
  }
  if (state.balances[action.caller] < action.input.qty) {
    return Left("Caller balance is not high enough.");
  }
  return Right({ state, action });
}
