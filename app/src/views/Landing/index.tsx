import React, { useEffect } from 'react';
import { env } from 'api';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

const ORDERBOOK_CONTRACT = 'hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8';

export default function Landing() {
	const { getUserAssets } = env;

	const [ordersState, setOrdersState] = React.useState<any>(null);

	useEffect(() => {
		getUserAssets('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4')
			.then((data) => {
				console.log('Fetched user assets:', data);
			})
			.catch(console.log);
	}, []);

	React.useEffect(() => {
		(async function () {
			setOrdersState(await readState(ORDERBOOK_CONTRACT));
		})();
	}, []);

	console.log(ordersState);

	return ordersState ? (
		<div className={'view-wrapper max-cutoff'}>
			{ordersState.pairs.map((order: any, index: number) => {
				return <p key={index}>{`Asset ${order.pair[0]}`}</p>;
			})}
		</div>
	) : null;
}

export const readState = async (tx: string) => {
	const warp = WarpFactory.forMainnet({
		...defaultCacheOptions,
		inMemory: true,
	});
	const contract = await warp
		.contract(tx)
		.connect('use_wallet')
		.setEvaluationOptions({
			internalWrites: true,
			unsafeClient: 'skip',
			remoteStateSyncSource: 'https://dre-6.warp.cc/contract',
			remoteStateSyncEnabled: false,
			allowBigInt: true,
		})
		.readState();
	return contract.cachedValue.state;
};
