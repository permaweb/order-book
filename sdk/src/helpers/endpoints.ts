export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts-u.warp.cc/balances?walletAddress=${walletAddress}&index=ucm&limit=1000`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}

export function getSyncEndpoint(contractId: string, dreNode: string) {
	return `${dreNode}/sync?id=${contractId}&test=false`;
}

export function getContractEndpoint(contractId: string, dreNode: string) {
	return `${dreNode}/contract?id=${contractId}&errorMessages=true`;
}

export function getTransactionLink(transactionId: string) {
	return `https://sonar.warp.cc/#/app/interaction/${transactionId}?network=mainnet`;
}
