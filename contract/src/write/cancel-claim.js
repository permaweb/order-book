export const cancelClaim = async (state, action) => {
  // validate
  ContractAssert(action.input.contract, 'contract is required')
  ContractAssert(action.input.transaction, 'transaction is required')
  ContractAssert(action.input.qty, 'transaction is required')
  ContractAssert(action.input.contract.length === 43, 'contract is not valid')
  ContractAssert(action.input.transaction.length === 43, 'transaction is not valid')
  ContractAssert(Number.isInteger(action.input.qty), 'qty must be integer')

  // process
  await SmartWeave.contracts.write(action.input.contract, {
    function: "reject",
    tx: action.input.transaction,
    qty: action.input.qty,
  });
  
  return { state }
}