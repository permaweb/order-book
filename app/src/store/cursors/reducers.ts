import { CursorEnum, CursorObjectKeyType } from 'permaweb-orderbook';

import { REDUX_TABLES } from 'helpers/redux';
import { ReduxActionType } from 'helpers/types';

import { SET_CURSORS } from './constants';
import { CursorsType } from './types';

export const initStateCursors: CursorsType = {
	idGQL: {
		[REDUX_TABLES.contractAssets]: [],
		[REDUX_TABLES.userAssets]: [],
		[REDUX_TABLES.collectionAssets]: [],
	},
};

export function cursorsReducer(state: CursorsType = initStateCursors, action: ReduxActionType) {
	switch (action.type) {
		case SET_CURSORS:
			return Object.assign({}, state, {
				idGQL: {
					[REDUX_TABLES.contractAssets]: checkPayload(action.payload, CursorEnum.idGQL, REDUX_TABLES.contractAssets)
						? action.payload.idGQL[REDUX_TABLES.contractAssets]
						: [],
					[REDUX_TABLES.userAssets]: checkPayload(action.payload, CursorEnum.idGQL, REDUX_TABLES.userAssets)
						? action.payload.idGQL[REDUX_TABLES.userAssets]
						: [],
					[REDUX_TABLES.collectionAssets]: checkPayload(action.payload, CursorEnum.idGQL, REDUX_TABLES.collectionAssets)
						? action.payload.idGQL[REDUX_TABLES.collectionAssets]
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
