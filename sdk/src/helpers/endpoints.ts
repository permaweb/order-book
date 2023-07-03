export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts.warp.cc/balances?walletAddress=${walletAddress}&limit=1000`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}

export function getSyncEndpoint(contractId: string) {
	return `https://dre-1.warp.cc/sync?id=${contractId}&test=false`;
}
