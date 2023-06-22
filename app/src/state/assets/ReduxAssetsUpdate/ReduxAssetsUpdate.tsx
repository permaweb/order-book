import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetType, OrderBook, OrderBookType } from 'permaweb-orderbook';

import * as assetActions from 'state/assets/actions';
import { RootState } from 'state/store';

export default function ReduxAssetsUpdate(props: { children: React.ReactNode }) {
	const dispatch = useDispatch();
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [sessionUpdated, setSessionUpdated] = React.useState<boolean>(false);

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

	// TODO: orderbook provider
	React.useEffect(() => {
		const GET_ENDPOINT = 'arweave-search.goldsky.com';
		const POST_ENDPOINT = 'arweave.net';

		const PORT = 443;
		const PROTOCOL = 'https';
		const TIMEOUT = 40000;
		const LOGGING = false;

		let arweaveGet = Arweave.init({
			host: GET_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		let arweavePost = Arweave.init({
			host: POST_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		let warp = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		});

		setOrderBook(
			OrderBook.init({
				currency: 'U',
				wallet: 'use_wallet',
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				warp: warp,
			})
		);
	}, []);

	React.useEffect(() => {
		if (orderBook) {
			(async function () {
				if (!assetsReducer.data || !sessionUpdated) {
					let assets: AssetType[] = await orderBook.api.getAssetsByContract();

					dispatch(assetActions.setAssets({ data: assets }));
					setSessionUpdated(true);
				}
			})();
		}
	}, [orderBook, sessionUpdated, assetsReducer.data, dispatch]);

	return <>{props.children}</>;
}
