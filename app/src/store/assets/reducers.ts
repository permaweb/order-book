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
				contractData: action.payload.contractData !== undefined ? action.payload.contractData : state.contractData,
				featuredData: action.payload.featuredData !== undefined ? action.payload.featuredData : state.featuredData,
				accountData: {
					address:
						action.payload.accountData !== undefined ? action.payload.accountData.address : state.accountData.address,
					data: action.payload.accountData !== undefined ? action.payload.accountData.data : state.accountData.data,
				},
				collectionData:
					action.payload.collectionData !== undefined ? action.payload.collectionData : state.collectionData,
			});
		default:
			return state;
	}
}
