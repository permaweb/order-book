import { PAGINATOR } from './config';

export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts.warp.cc/balances?walletAddress=${walletAddress}&limit=${PAGINATOR}`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}