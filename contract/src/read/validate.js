export function validate(state) {
  ContractAssert(state.name, "Name is required!");
  ContractAssert(state.ticker, "Ticker is required!");
  ContractAssert(state.balances, "Balances Object is required!");
  ContractAssert(state.pairs, "Pairs Array is required!");
}
