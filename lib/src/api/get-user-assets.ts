import Async from 'hyper-async';
const { of, fromPromise } = Async;

export const getUserAssets = (tx: string) => {
	console.log('TX', tx);
	return of(tx);
};
