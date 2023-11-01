import { ReduxActionType } from 'helpers/types';

import { SET_ASSETS } from './constants';
import { AssetsType } from './types';

export const initStateAssets: AssetsType = {
	contractData: null,
	featuredData: null,
	accountData: { address: null, data: null },
	collectionData: null,
};

export function assetsReducer(state: AssetsType = initStateAssets, action: ReduxActionType) {
	switch (action.type) {
		case SET_ASSETS:
			return Object.assign({}, state, {
				contractData: action.payload.contractData !== undefined ? action.payload.contractData : null,
				featuredData: action.payload.featuredData !== undefined ? action.payload.featuredData : null,
				accountData: {
					address: action.payload.accountData !== undefined ? action.payload.accountData.address : null,
					data: action.payload.accountData !== undefined ? action.payload.accountData.data : null,
				},
				collectionData: action.payload.collectionData !== undefined ? action.payload.collectionData : null,
			});
		default:
			return state;
	}
}
