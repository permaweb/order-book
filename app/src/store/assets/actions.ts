import { Dispatch } from 'redux';

import { SET_ASSETS } from './constants';
import { AssetsType } from './types';

export function setAssets(payload: AssetsType) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_ASSETS,
			payload: payload,
		});
	};
}
