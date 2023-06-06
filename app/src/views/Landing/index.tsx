import React from 'react';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

const ORDERBOOK_CONTRACT = "hY3jZrvejIjQmLjya3yarDyKNgdiG-BiR6GxG_X3rY8";

export default function Landing() {
	const [ordersState, setOrdersState] = React.useState<any>(null);

	React.useEffect(() => {
		(async function () {
			setOrdersState(await readState(ORDERBOOK_CONTRACT));
		})();
	}, []);

	console.log(ordersState)

	return ordersState ? (
		<div className={'view-wrapper max-cutoff'}>
			{ordersState.pairs.map((order: any, index: number) => {
				return (
					<p key={index}>{`Asset ${order.pair[0]}`}</p>
				)
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
