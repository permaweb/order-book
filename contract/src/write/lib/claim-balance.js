import { of, fromPromise, Resolved, Rejected } from "hyper-async";

export function claimBalance(state, action) {
  const write = fromPromise(SmartWeave.contracts.write);

  return of({ state, action })
    .chain(validate)
    .chain(({ state, action }) =>
      write(action.input.target, {
        function: "claim",
        txID: action.input.transaction,
        qty: action.input.qty,
      }).map((r) => ({ state }))
    );
}

function validate({ state, action }) {
  if (!action.input.transaction) {
    return Rejected("transaction is required!");
  }
  if (!action.input.target) {
    return Rejected("target is required!");
  }
  if (!action.input.transaction.length === 43) {
    return Rejected("invalid tx");
  }
  if (!action.input.target.length === 43) {
    return Rejected("invalid target");
  }
  if (!action.input.qty) {
    return Rejected("qty is required!");
  }
  if (!Number.isInteger(action.input.qty)) {
    return Rejected("qty must be integer");
  }
  return Resolved({ state, action });
}
