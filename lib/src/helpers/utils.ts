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

export function checkGqlCursor(string: string): boolean {
	/* All Search Cursors contain '-'
		GQL Cursors contain letters, numbers or '=' */
	if (/[-]/.test(string)) {
		return false;
	} else if (/[A-Za-z0-9]/.test(string) || /[=]/.test(string)) {
		return true;
	} else {
		return true;
	}
}

export function unquoteJsonKeys(json: Object): string {
	return JSON.stringify(json).replace(/"([^"]+)":/g, '$1:');
}
