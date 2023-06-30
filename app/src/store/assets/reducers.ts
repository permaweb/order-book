import { ReduxActionType } from 'helpers/types';

import { SET_ASSETS } from './constants';
import { AssetsType } from './types';

export const initStateAssets: AssetsType = {
	data: null,
	featuredData: null,
};

export function assetsReducer(state: AssetsType = initStateAssets, action: ReduxActionType) {
	switch (action.type) {
		case SET_ASSETS:
			// return Object.assign({}, state, {
			// 	data: action.payload.data ?? state.data,
			// 	featuredData: action.payload.featuredData ?? state.featuredData,
			// });
			return Object.assign({}, state, {
				data: action.payload.data,
				featuredData: action.payload.featuredData,
			});
		default:
			return state;
	}
}
