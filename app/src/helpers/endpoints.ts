export function getArweaveBalanceEndpoint(walletAddress: string) {
	return `https://arweave.net/wallet/${walletAddress}/balance`;
}

export function getCurrencyBalanceEndpoint(walletAddress: string, currencyContract: string, dreNode: string) {
	return `${dreNode}/contract?id=${currencyContract}&query=$.balances.${walletAddress}`;
}

export function getRendererEndpoint(renderWith: string, tx: string) {
	return `https://${renderWith}.arweave.dev/?tx=${tx}`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}
