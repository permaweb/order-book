export function getArweaveBalanceEndpoint(walletAddress: string) {
	return `https://arweave.net/wallet/${walletAddress}/balance`;
}

export function getCurrencyBalanceEndpoint(walletAddress: string, currencyContract: string, dreNode: string) {
	return `${dreNode}/contract?id=${currencyContract}&query=$.balances.${walletAddress}`;
}

export function getRendererEndpoint(renderWith: string, tx: string) {
	if (/[A-Za-z0-9]/.test(renderWith) || (/[=]/.test(renderWith) && renderWith.length === 43)) {
		return `https://arweave.net/${renderWith}/?tx=${tx}`;
	} else {
		return `https://${renderWith}.arweave.dev/?tx=${tx}`;
	}
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}
