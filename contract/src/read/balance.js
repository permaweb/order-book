export function balance(state, action) {
  if (!action.input.target) {
    action.input.target = action.caller;
  }
  ContractAssert(
    /[a-z0-9_-]{43}/i.test(action.input.target),
    "Invalid Target!"
  );
  if (!state.balances[action.input.target]) {
    return {
      result: {
        target: action.input.target,
        balance: 0,
      },
    };
  }
  return {
    result: {
      target: action.input.target,
      balance: state.balances[action.input.target],
    },
  };
}
