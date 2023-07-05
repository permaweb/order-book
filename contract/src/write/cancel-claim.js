export const cancelClaim = async (state, action) => {
  // validate
  ContractAssert(action.input.contract, 'contract is required')
  ContractAssert(action.input.transaction, 'transaction is required')
  ContractAssert(action.input.contract.length === 43, 'contract is not valid')
  ContractAssert(action.input.transaction.length === 43, 'transaction is not valid')

  // process
  await SmartWeave.contracts.write(action.input.contract, {
    function: "reject",
    txID: action.input.transaction,
    qty,
  });
  
  return { state }
}