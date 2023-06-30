import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stamps from '@permaweb/stampjs';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

LoggerFactory.INST.logLevel('fatal');

import { AssetType, CursorEnum, OrderBook, OrderBookType, PAGINATOR, STORAGE } from 'permaweb-orderbook';

import { FEATURE_COUNT } from 'helpers/config';
import { REDUX_TABLES } from 'helpers/redux';
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
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

	// const [sessionUpdated, setSessionUpdated] = React.useState<boolean>(false);
	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

	const [stamps, setStamps] = React.useState<any>(null);

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
			setStamps(
				Stamps.init({
					warp: orderBook.env.arClient.warpDefault,
					arweave: orderBook.env.arClient.arweavePost,
				})
			);
		}
	}, [orderBook]);

	// React.useEffect(() => {
	// 	dispatch(assetActions.setAssets({ data: null, featuredData: null }));
	// 	dispatch(
	// 		cursorActions.setCursors({
	// 			idGQL: {
	// 				[REDUX_TABLES.contractAssets]: [],
	// 				[REDUX_TABLES.userAssets]: [],
	// 			},
	// 		})
	// 	);
	// }, [props.currentTableCursor]);

	React.useEffect(() => {
		if (orderBook && stamps) {
			(async function () {
				if (props.reduxCursor && props.cursorObject && cursorsReducer[props.cursorObject]) {
					const currentReducer = cursorsReducer[props.cursorObject];
					if (currentReducer[props.reduxCursor]) {
						const updatedReducer = currentReducer[props.reduxCursor];
						let contractIds: string[] = [];
						switch (props.apiFetch) {
							case 'contract':
								contractIds = await orderBook.api.getAssetIdsByContract();
								// // Rank by stamps
								// const counts = await stamps.counts(contractIds);
								// contractIds.sort((a: string, b: string) => {
								// 	const totalA = counts[a]?.total || 0;
								// 	const totalB = counts[b]?.total || 0;

								// 	if (totalB !== totalA) {
								// 		return totalB - totalA;
								// 	}

								// 	// If 'total' is the same, sort by 'id' in descending order.
								// 	return b.localeCompare(a);
								// });
								break;
							case 'user':
								if (arProvider.walletAddress) {
									contractIds = await orderBook.api.getAssetIdsByUser({ walletAddress: arProvider.walletAddress });
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
	}, [orderBook, stamps, arProvider.walletAddress, props.currentTableCursor]);

	React.useEffect(() => {
		(async function () {
			const reducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (reducer && reducer.length && orderBook && props.currentTableCursor && stamps) {
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

						// await new Promise((r) => setTimeout(r, 2000));

						switch (props.apiFetch) {
							case 'contract':
								// Rank by stamps
								// let assetIds: string[] = fetchedAssets.map((a: AssetType) => a.data.id);
								// const counts = await stamps.counts(assetIds);
								// fetchedAssets.sort((a: AssetType, b: AssetType) => {
								// 	const totalA = counts[a.data.id]?.total || 0;
								// 	const totalB = counts[b.data.id]?.total || 0;

								// 	if (totalB !== totalA) {
								// 		return totalB - totalA;
								// 	}

								// 	// If 'total' is the same, sort by 'id' in descending order.
								// 	return b.data.id.localeCompare(a.data.id);
								// });
								let finalFeaturedAssets: AssetType[] = fetchedAssets.slice(0, FEATURE_COUNT);
								let finalTableAssets: AssetType[] = [];
								if (fetchedAssets.length >= FEATURE_COUNT) {
									finalTableAssets = fetchedAssets.slice(FEATURE_COUNT);
								}
								dispatch(assetActions.setAssets({ data: finalTableAssets, featuredData: finalFeaturedAssets }));
								break;
							case 'user':
								dispatch(assetActions.setAssets({ data: fetchedAssets }));
								break;
						}
					}
				}
			}
			// else {
			// 	dispatch(assetActions.setAssets({ data: [] }));
			// }
		})();
	}, [cursorsReducer, props.currentTableCursor, orderBook, stamps]);

	return <>{props.children}</>;
}
