import { ReduxActionType } from 'helpers/types';

import { SET_ASSETS } from './constants';
import { AssetsType } from './types';

export const initStateAssets: AssetsType = {
	contractData: null,
	featuredData: null,
	accountData: null,
	collectionData: null,
};

export function assetsReducer(state: AssetsType = initStateAssets, action: ReduxActionType) {
	switch (action.type) {
		case SET_ASSETS:
			return Object.assign({}, state, {
				contractData: action.payload.contractData,
				featuredData: action.payload.featuredData,
				accountData: action.payload.accountData,
				collectionData: action.payload.collectionData,
			});
		default:
			return state;
	}
}
