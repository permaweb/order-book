import { DRE_NODES } from 'helpers/config';
import { DREObjectType, ReduxActionType } from 'helpers/types';

import { SET_DRE_NODE } from './constants';

export const initStateDRENode: DREObjectType = DRE_NODES[0];

export function dreReducer(state: DREObjectType = initStateDRENode, action: ReduxActionType) {
	switch (action.type) {
		case SET_DRE_NODE:
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}
