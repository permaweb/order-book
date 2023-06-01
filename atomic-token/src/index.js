import { of, Left, Right } from "./lib/either.js";

const identity = (x) => x;

export function handle(state, action) {
  switch (action?.input?.function) {
    case "allow":
      return allow(state, action).fold(handleError, identity);
    case "claim":
      return claim(state, action).fold(handleError, identity);
    case "transfer":
      return transfer(state, action).fold(handleError, identity);
    case "balance":
      return balance(state, action).fold(handleError, identity);
    default:
      throw new ContractError("No Function Found");
  }
}

function handleError(msg) {
  throw new ContractError(msg);
}

function allow(state, action) {
  return of({ state, action })
    .chain(({ state, action }) => {
      if (
        !Number.isInteger(action.input.qty) ||
        action.input.qty === undefined
      ) {
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
    })
    .map(({ state, action }) => {
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
    });
}

function claim(state, action) {
  return of({ state, action })
    .chain(({ state, action }) => {
      if (!action.input.txID) {
        return Left("txID is not found.");
      }

      if (!action.input.qty) {
        return Left("claim quantity is not specified.");
      }

      const idx = state.claimable.findIndex(
        (c) => c.txID === action.input.txID
      );

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
    })
    .map(({ state, action, idx }) => {
      if (!state.balances[action.caller]) {
        state.balances[action.caller] = 0;
      }
      state.balances[action.caller] += action.input.qty;
      state.claimable.splice(idx, 1);
      return { state };
    });
}

function transfer(state, action) {
  return of({ state, action })
    .chain(({ state, action }) => {
      if (!action.caller || action.caller.length !== 43) {
        return Left("Caller is not valid");
      }

      if (!action.input.qty || typeof action.input.qty !== "number") {
        return Left("qty is not defined or is not a number");
      }

      if (!action.input.target || action.input.target.length !== 43) {
        return Left("target is not valid");
      }

      if (action.caller === action.input.target) {
        return Left("target cannot be caller");
      }

      if (!state.balances[action.input.target]) {
        state.balances[action.input.target] = 0;
      }
      if (!state.balances[action.caller]) {
        state.balances[action.caller] = 0;
      }

      if (state.balances[action.caller] < action.input.qty) {
        return Left("not enough balance to transfer");
      }
      return Right({ state, action });
    })
    .map(({ state, action }) => {
      state.balances[action.caller] -= action.input.qty;
      state.balances[action.input.target] += action.input.qty;
      return { state };
    });
}

function balance(state, action) {
  return of({ state, action })
    .chain(({ state, action }) => {
      if (!action.input.target) {
        action.input.target = action.caller;
      }
      if (action.caller.length !== 43) {
        return Left("Caller is not valid");
      }
      return Right({ state, action });
    })
    .map(({ state, action }) => ({
      result: {
        target: action.input.target,
        balance: state.balances[action.input.target] || 0,
      },
    }));
}
