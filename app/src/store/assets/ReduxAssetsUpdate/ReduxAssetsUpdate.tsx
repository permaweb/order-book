import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

LoggerFactory.INST.logLevel('fatal');

import { AssetType, CursorEnum, OrderBook, OrderBookType } from 'permaweb-orderbook';

import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';

export default function ReduxAssetsUpdate(props: {
	reduxCursor: string;
	cursorObject: CursorEnum;
	children: React.ReactNode;
}) {
	const dispatch = useDispatch();
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

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
				walletAddress: null,
			})
		);
	}, []);

	React.useEffect(() => {
		if (orderBook) {
			(async function () {
				if (!sessionUpdated) {
					let assets: AssetType[] = await orderBook.api.getAssetsByContract({
						ids: null,
						owner: null,
						uploader: null,
						cursor: null,
						reduxCursor: REDUX_TABLES.contractAssets,
						walletAddress: null,
					});

					if (assets && assets.length) {
						dispatch(assetActions.setAssets({ data: assets }));
					}
					setSessionUpdated(true);
				}
			})();
		}
	}, [orderBook, sessionUpdated, assetsReducer.data, dispatch]);

	React.useEffect(() => {
		if (orderBook) {
			(async function () {
				console.log(await OrderBook.api.getAssetIdsByContract());
			})()
		}
	}, [orderBook])

	// if (props.reduxCursor && props.cursorObject && cursorsReducer[props.cursorObject]) {
	// 	const currentReducer = cursorsReducer[props.cursorObject];
	// 	if (currentReducer[props.reduxCursor]) {
	// 		const updatedReducer = currentReducer[props.reduxCursor];
	// 		updatedReducer.push({
	// 			index: `${props.reduxCursor}-${props.cursorObject}-${currentReducer[props.reduxCursor].length}`,
	// 			ids: assets.map((asset: AssetType) => {
	// 				return asset.data.id;
	// 			}),
	// 		});
	// 		dispatch(cursorActions.setCursors({ [props.cursorObject]: { [props.reduxCursor]: updatedReducer } }));
	// 	}
	// }

	return <>{props.children}</>;
}
