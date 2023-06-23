import { Dispatch } from 'redux';

import { SET_CURSORS } from './constants';
import { CursorsType } from './types';

export function setCursors(payload: CursorsType) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_CURSORS,
			payload: payload,
		});
	};
}
