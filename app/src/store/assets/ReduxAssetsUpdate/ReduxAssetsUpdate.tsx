import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

LoggerFactory.INST.logLevel('fatal');

import { AssetType, CursorEnum, OrderBook, OrderBookType, PAGINATOR, STORAGE } from 'permaweb-orderbook';

import { ApiFetchType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';

export default function ReduxAssetsUpdate(props: {
	reduxCursor: string;
	apiFetch: ApiFetchType;
	cursorObject: CursorEnum;
	currentTableCursor: string | null;
	children: React.ReactNode;
}) {
	const arProvider = useArweaveProvider();

	const dispatch = useDispatch();
	// const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

	// const [sessionUpdated, setSessionUpdated] = React.useState<boolean>(false);
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
				if (props.reduxCursor && props.cursorObject && cursorsReducer[props.cursorObject]) {
					const currentReducer = cursorsReducer[props.cursorObject];
					if (currentReducer[props.reduxCursor]) {
						const updatedReducer = currentReducer[props.reduxCursor];
						let contractIds: string[] = [];
						switch (props.apiFetch) {
							case 'contract':
								contractIds = await OrderBook.api.getAssetIdsByContract();
								break;
							case 'user':
								if (arProvider.walletAddress) {
									contractIds = await OrderBook.api.getAssetIdsByUser({ walletAddress: arProvider.walletAddress });
								}
								break;
						}
						for (let i = 0; i < contractIds.length; i += PAGINATOR) {
							updatedReducer.push({
								index: `${props.reduxCursor}-${props.cursorObject}-${currentReducer[props.reduxCursor].length}`,
								ids: [...contractIds].slice(i, i + PAGINATOR),
							});
						}
						dispatch(cursorActions.setCursors({ [props.cursorObject]: { [props.reduxCursor]: updatedReducer } }));
					}
				}
			})();
		}
	}, [orderBook, arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			const reducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (reducer && reducer.length && orderBook && props.currentTableCursor) {
				for (let i = 0; i < reducer.length; i++) {
					if (props.currentTableCursor === reducer[i].index) {
						const fetchedAssets = await orderBook.api.getAssetsByIds({
							ids: reducer[i].ids,
							owner: null,
							uploader: null,
							cursor: null,
							reduxCursor: props.reduxCursor,
							walletAddress: null,
						});
						// const finalAssets = fetchedAssets.filter((asset: AssetType) => {
						// 	return (asset.data.title !== STORAGE.none)
						// });
						dispatch(assetActions.setAssets({ data: fetchedAssets }));
					}
				}
			} else {
				dispatch(assetActions.setAssets({ data: [] }));
			}
		})();
	}, [cursorsReducer, props.currentTableCursor, orderBook]);

	return <>{props.children}</>;
}
