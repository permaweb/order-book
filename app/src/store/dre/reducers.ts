import { DREObjectType, ReduxActionType } from 'helpers/types';

import { SET_DRE_NODE } from './constants';

export const initStateDRENode: DREObjectType = {
	label: 'DRE-U',
	source: 'https://dre-u.warp.cc/contract',
};

export function dreReducer(state: DREObjectType = initStateDRENode, action: ReduxActionType) {
	switch (action.type) {
		case SET_DRE_NODE:
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}
