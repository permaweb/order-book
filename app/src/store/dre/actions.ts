import { Dispatch } from 'redux';

import { DREObjectType } from 'helpers/types';

import { SET_DRE_NODE } from './constants';

export function setNode(payload: DREObjectType) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_DRE_NODE,
			payload: payload,
		});
	};
}
