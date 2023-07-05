export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts.warp.cc/balances?walletAddress=${walletAddress}&limit=1000`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}

export function getSyncEndpoint(contractId: string, dreNode: string) {
	return `${dreNode}/sync?id=${contractId}&test=false`;
}
