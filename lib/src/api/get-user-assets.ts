import Async from 'hyper-async';
const { of, fromPromise } = Async;

/**
 * Fetches the user assets.  This will fetch 20 by default.  Change the limit parameter to change that.
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @param {string} [page]
 * @param {string} [limit]
 * @return {*}  {GetUserAssetsOutput}
 */
export const getUserAssets = async (tx: string, page?: number, limit?: number): Promise<GetUserAssetsOutput> => {
	return of({ tx, page, limit }).chain(fromPromise(fetchUserAssets)).toPromise();
};

async function fetchUserAssets(input: { tx: string; page?: number; limit?: number }): Promise<GetUserAssetsOutput> {
	const { tx, page, limit } = input;
	return fetch(
		`https://contracts.warp.cc/balances?walletAddress=${tx}&limit=${limit || '30'}${page ? `&page=${page}` : ''}`
	).then((res) =>
		res.ok ? (res.json() as unknown as GetUserAssetsOutput) : Promise.reject('Error fetching user assets.')
	);
}

interface Paging {
	limit: number;
	items: number;
	page: number;
}

interface Balance {
	contract_tx_id: string;
	token_ticker: string;
	token_name: string;
	balance: string;
	sort_key: string;
}

interface GetUserAssetsOutput {
	paging: Paging;
	balances: Balance[];
}

// export interface GetUserAssetsOutput {
// 	data: Data;
// }
