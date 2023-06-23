import { PAGINATOR } from './config';

export function getArweaveBalanceEndpoint(walletAddress: string) {
	return `https://arweave.net/wallet/${walletAddress}/balance`;
}

export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts.warp.cc/balances?walletAddress=${walletAddress}&limit=${PAGINATOR}`;
}

// TODO: support all renderers
export function getRendererEndpoint(renderWith: string, tx: string) {
	return `https://${renderWith}.arweave.dev/?tx=${tx}`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}
