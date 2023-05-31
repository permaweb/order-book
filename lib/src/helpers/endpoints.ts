export function getBalanceEndpoint(wallet: string) {
	return `https://arweave.net/wallet/${wallet}/balance`;
}

export function getViewblockEndpoint(txId: string) {
	return `https://v2.viewblock.io/arweave/tx/${txId}`;
}

export function getTxEndpoint(txId: string) {
	return `https://arweave.net/${txId}`;
}

export function getRedstoneSrcTxEndpoint(contractId: string, page: number) {
	return `https://gateway.redstone.finance/gateway/contracts-by-source?id=${contractId}&limit=15&page=${page.toString()}`;
}

export function getRedstoneDescEndpoint(src: string, page: number, limit: number) {
	return `https://gateway.redstone.finance/gateway/contracts-by-source?id=${src}&page=${page.toString()}&sort=desc&limit=${limit.toString()}`;
}

export function getRendererEndpoint(renderWith: string, tx: string) {
	return `https://${renderWith}.arweave.dev/?tx=${tx}`;
}

export const sonarLink = (contractId: string) => `https://sonar.warp.cc/#/app/contract/${contractId}`;
