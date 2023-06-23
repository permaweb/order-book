import { ReduxActionType } from 'helpers/types';

import { SET_ASSETS } from './constants';
import { AssetsType } from './types';

export const initStatePools: AssetsType = {
	data: null,
};

export function assetsReducer(state: AssetsType = initStatePools, action: ReduxActionType) {
	switch (action.type) {
		case SET_ASSETS:
			return Object.assign({}, state, {
				data: action.payload.data ?? state.data,
			});
		default:
			return state;
	}
}
