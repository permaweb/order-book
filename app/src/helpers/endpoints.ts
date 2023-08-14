import { checkAddress, getHost } from './utils';

export function getArweaveBalanceEndpoint(walletAddress: string) {
	return `https://${getHost()}/wallet/${walletAddress}/balance`;
}

export function getCurrencyBalanceEndpoint(walletAddress: string, currencyContract: string, dreNode: string) {
	return `${dreNode}/contract?id=${currencyContract}&query=$.balances.${walletAddress}`;
}

export function getRendererEndpoint(renderWith: string, tx: string) {
	if (checkAddress(renderWith)) {
		return `https://${getHost()}/${renderWith}/?tx=${tx}`;
	} else {
		return `https://${renderWith}.arweave.dev/?tx=${tx}`;
	}
}

export function getTxEndpoint(txId: string) {
	return `https://${getHost()}/${txId}`;
}
