import { PAGINATOR } from './config';

export function getBalancesEndpoint(walletAddress: string) {
	return `https://contracts.warp.cc/balances?walletAddress=${walletAddress}&limit=${PAGINATOR}`;
}