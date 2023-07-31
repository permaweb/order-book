import { STORAGE } from './config';

export function pairExists(pair: string[], orderBookState: any) {
	for (let i = 0; i < orderBookState.pairs.length; i++) {
		let pairI = orderBookState.pairs[i].pair;
		if (pairI[0] === pair[0]) {
			if (pairI[1] === pair[1]) {
				return true;
			}
		}
	}
	return false;
}

export function getTagValue(list: { [key: string]: any }[], name: string): string {
	for (let i = 0; i < list.length; i++) {
		if (list[i]) {
			if (list[i]!.name === name) {
				return list[i]!.value as string;
			}
		}
	}
	return STORAGE.none;
}

export function unquoteJsonKeys(json: Object): string {
	return JSON.stringify(json)
		.replace(/"([^"]+)":/g, '$1:')
		.replace(/"FUZZY_OR"/g, 'FUZZY_OR');
}

export function isSingleQtyAsset(assetState: any) {
	let balances = Object.keys(assetState.balances);
	if (balances.length > 1 || balances.length === 0) {
		return false;
	}
	if (assetState.balances[balances[0]] !== 1) {
		return false;
	}
	return true;
}

export function log(message: any, status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message} - log status ${status}`);
}

export function logValue(message: any, value: any, status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message} - ['${value}'] - log status ${status}`);
}

export function getObjectSizeInKb(obj: any) {
	const jsonString = JSON.stringify(obj);
	const bytes = new TextEncoder().encode(jsonString).length;
	const kilobytes = bytes / 1024;
	return kilobytes;
}
