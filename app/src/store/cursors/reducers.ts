import { CursorEnum, CursorObjectKeyType } from 'permaweb-orderbook';

import { REDUX_TABLES } from 'helpers/redux';
import { ReduxActionType } from 'helpers/types';

import { SET_CURSORS } from './constants';
import { CursorsType } from './types';

export const initStateCursors: CursorsType = {
	idGql: {
		[REDUX_TABLES.contractAssets]: [],
	},
};

export function cursorsReducer(state: CursorsType = initStateCursors, action: ReduxActionType) {
	switch (action.type) {
		case SET_CURSORS:
			return Object.assign({}, state, {
				idGql: {
					[REDUX_TABLES.contractAssets]: checkPayload(action.payload, CursorEnum.idGQL, REDUX_TABLES.contractAssets)
						? action.payload.idGql[REDUX_TABLES.contractAssets]
						: [],
				},
			});
		default:
			return state;
	}
}

function checkPayload(payload: any, objectKey: CursorObjectKeyType, reduxCursor: string) {
	if (!payload[objectKey!]) {
		return false;
	} else {
		if (payload[objectKey!][reduxCursor]) {
			return true;
		} else {
			return false;
		}
	}
}
