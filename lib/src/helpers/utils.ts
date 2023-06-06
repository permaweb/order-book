import { TransactionFlowArgs, ValidateArgs } from './types';

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
