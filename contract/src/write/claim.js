import { of, Left, Right } from "../lib/either.js";

export const claim = (state, action) =>
  of({ state, action }).chain(validate).map(update);

function update({ state, action, idx }) {
  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0;
  }

  state.balances[action.caller] += action.input.qty;
  state.claimable.splice(idx, 1);

  return { state };
}

function validate({ state, action }) {
  if (!action.input.txID) {
    return Left("txID is not found.");
  }

  if (!action.input.qty) {
    return Left("claim quantity is not specified.");
  }

  const idx = state.claimable.findIndex((c) => c.txID === action.input.txID);

  if (idx < 0) {
    return Left("claimable not found.");
  }

  if (state.claimable[idx].qty !== action.input.qty) {
    return Left("claimable qty is not equal to claim qty.");
  }

  if (state.claimable[idx].to !== action.caller) {
    return Left("claim is not addressed to caller.");
  }

  return Right({ state, action, idx });
}
