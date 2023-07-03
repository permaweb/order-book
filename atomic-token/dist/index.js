// src/lib/either.js
var Right = (x) => ({
  isLeft: false,
  chain: (f) => f(x),
  ap: (other) => other.map(x),
  alt: (other) => Right(x),
  extend: (f) => f(Right(x)),
  concat: (other) => other.fold(
    (x2) => other,
    (y) => Right(x.concat(y))
  ),
  traverse: (of2, f) => f(x).map(Right),
  map: (f) => Right(f(x)),
  fold: (_, g) => g(x),
  toString: () => `Right(${x})`,
  extract: () => x
});
var Left = (x) => ({
  isLeft: true,
  chain: (_) => Left(x),
  ap: (_) => Left(x),
  extend: (_) => Left(x),
  alt: (other) => other,
  concat: (_) => Left(x),
  traverse: (of2, _) => of2(Left(x)),
  map: (_) => Left(x),
  fold: (f, _) => f(x),
  toString: () => `Left(${x})`,
  extract: () => x
});
var of = Right;

// src/index.js
var identity = (x) => x;
function handle(state, action) {
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
  return of({ state, action }).chain(({ state: state2, action: action2 }) => {
    if (!Number.isInteger(action2.input.qty) || action2.input.qty === void 0) {
      return Left("Invalid value for quantity. Must be an integer.");
    }
    if (!action2?.input?.target) {
      return Left("No target specified.");
    }
    if (action2.input.target.length !== 43) {
      return Left("Target is not valid!");
    }
    if (action2.input.target === SmartWeave.transaction.id) {
      return Left("Cant setup claim to transfer a balance to itself");
    }
    if (action2.caller === action2.input.target) {
      return Left("Invalid balance transfer");
    }
    if (!state2.balances[action2.caller]) {
      return Left("Caller does not have a balance");
    }
    if (state2.balances[action2.caller] < action2.input.qty) {
      return Left("Caller balance is not high enough.");
    }
    return Right({ state: state2, action: action2 });
  }).map(({ state: state2, action: action2 }) => {
    state2.balances[action2.caller] -= action2.input.qty;
    if (!state2.claimable) {
      state2.claimable = [];
    }
    state2.claimable.push({
      from: action2.caller,
      to: action2.input.target,
      qty: action2.input.qty,
      txID: SmartWeave.transaction.id
    });
    return { state: state2 };
  });
}
function claim(state, action) {
  return of({ state, action }).chain(({ state: state2, action: action2 }) => {
    if (!action2.input.txID) {
      return Left("txID is not found.");
    }
    if (!action2.input.qty) {
      return Left("claim quantity is not specified.");
    }
    const idx = state2.claimable.findIndex(
      (c) => c.txID === action2.input.txID
    );
    if (idx < 0) {
      return Left("claimable not found.");
    }
    if (state2.claimable[idx].qty !== action2.input.qty) {
      return Left("claimable qty is not equal to claim qty.");
    }
    if (state2.claimable[idx].to !== action2.caller) {
      return Left("claim is not addressed to caller.");
    }
    return Right({ state: state2, action: action2, idx });
  }).map(({ state: state2, action: action2, idx }) => {
    if (!state2.balances[action2.caller]) {
      state2.balances[action2.caller] = 0;
    }
    state2.balances[action2.caller] += action2.input.qty;
    state2.claimable.splice(idx, 1);
    return { state: state2 };
  });
}
function transfer(state, action) {
  return of({ state, action }).chain(({ state: state2, action: action2 }) => {
    if (!action2.caller || action2.caller.length !== 43) {
      return Left("Caller is not valid");
    }
    if (!action2.input.qty || typeof action2.input.qty !== "number") {
      return Left("qty is not defined or is not a number");
    }
    if (!action2.input.target || action2.input.target.length !== 43) {
      return Left("target is not valid");
    }
    if (action2.caller === action2.input.target) {
      return Left("target cannot be caller");
    }
    if (!state2.balances[action2.input.target]) {
      state2.balances[action2.input.target] = 0;
    }
    if (!state2.balances[action2.caller]) {
      state2.balances[action2.caller] = 0;
    }
    if (state2.balances[action2.caller] < action2.input.qty) {
      return Left("not enough balance to transfer");
    }
    return Right({ state: state2, action: action2 });
  }).map(({ state: state2, action: action2 }) => {
    state2.balances[action2.caller] -= action2.input.qty;
    state2.balances[action2.input.target] += action2.input.qty;
    return { state: state2 };
  });
}
function balance(state, action) {
  return of({ state, action }).chain(({ state: state2, action: action2 }) => {
    if (!action2.input.target) {
      action2.input.target = action2.caller;
    }
    if (action2.caller.length !== 43) {
      return Left("Caller is not valid");
    }
    return Right({ state: state2, action: action2 });
  }).map(({ state: state2, action: action2 }) => ({
    result: {
      target: action2.input.target,
      balance: state2.balances[action2.input.target] || 0
    }
  }));
}
