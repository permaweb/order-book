import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stamps from '@permaweb/stampjs';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

import { AssetType, CursorEnum, OrderBook, OrderBookType, PAGINATOR } from 'permaweb-orderbook';

import { FEATURE_COUNT } from 'helpers/config';
import { ApiFetchType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';

LoggerFactory.INST.logLevel('fatal');

export default function ReduxAssetsUpdate(props: {
	reduxCursor: string;
	apiFetch: ApiFetchType;
	cursorObject: CursorEnum;
	currentTableCursor: string | null;
	children: React.ReactNode;
}) {
	const arProvider = useArweaveProvider();

	const dispatch = useDispatch();
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

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
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				warp: warp,
				warpDreNode: dreReducer.source,
			})
		);
	}, [dreReducer.source]);

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

								// Rank by stamps
								const counts = await stamps.counts(contractIds);
								contractIds.sort((a: string, b: string) => {
									const totalA = counts[a]?.total || 0;
									const totalB = counts[b]?.total || 0;

									if (totalB !== totalA) {
										return totalB - totalA;
									}

									// If 'total' is the same, sort by 'id' in descending order.
									return b.localeCompare(a);
								});
								break;
							case 'user':
								if (arProvider.walletAddress) {
									contractIds = await orderBook.api.getAssetIdsByUser({ walletAddress: arProvider.walletAddress });
								}
								break;
						}

						let groupIndex = new Map(currentReducer[props.reduxCursor].map((group: any) => [group.index, group.ids]));

						for (let i = 0; i < contractIds.length; i += PAGINATOR) {
							const cursorIds = [...contractIds].slice(i, i + PAGINATOR);
							const newIndex = `${props.reduxCursor}-${props.cursorObject}-${currentReducer[props.reduxCursor].length}`;

							if (
								![...groupIndex.values()].some((ids: any) =>
									ids.every((id: any, index: any) => id === cursorIds[index])
								)
							) {
								updatedReducer.push({
									index: newIndex,
									ids: cursorIds,
								});
							}
						}
						dispatch(cursorActions.setCursors({ [props.cursorObject]: { [props.reduxCursor]: updatedReducer } }));
					}
				}
			})();
		}
	}, [orderBook, stamps, arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			const reducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (reducer && reducer.length && orderBook && props.currentTableCursor && stamps) {
				for (let i = 0; i < reducer.length; i++) {
					if (props.currentTableCursor === reducer[i].index) {
						let fetchedAssets = await orderBook.api.getAssetsByIds({
							ids: reducer[i].ids,
							owner: null,
							uploader: null,
							cursor: null,
							reduxCursor: props.reduxCursor,
							walletAddress: null,
						});

						const assetIds: string[] = fetchedAssets.map((a: AssetType) => a.data.id);
						const counts = await stamps.counts(assetIds);

						// Add stamp counts to assets
						fetchedAssets = fetchedAssets.map((asset: AssetType) => {
							return { ...asset, stamps: counts[asset.data.id] };
						});

						// Rank by stamps
						fetchedAssets.sort((a: AssetType, b: AssetType) => {
							const totalA = counts[a.data.id]?.total || 0;
							const totalB = counts[b.data.id]?.total || 0;

							if (totalB !== totalA) {
								return totalB - totalA;
							}

							// If 'total' is the same, sort by 'id' in descending order.
							return b.data.id.localeCompare(a.data.id);
						});

						switch (props.apiFetch) {
							case 'contract':
								let finalFeaturedAssets: AssetType[] = fetchedAssets.slice(0, FEATURE_COUNT);
								let finalTableAssets: AssetType[] = [];
								if (fetchedAssets.length >= FEATURE_COUNT) {
									finalTableAssets = fetchedAssets.slice(FEATURE_COUNT);
								}
								dispatch(assetActions.setAssets({ contractData: finalTableAssets, featuredData: finalFeaturedAssets }));
								break;
							case 'user':
								dispatch(assetActions.setAssets({ accountData: fetchedAssets }));
								break;
						}
					}
				}
			}
		})();
	}, [cursorsReducer, props.currentTableCursor, orderBook, stamps]);

	return <>{props.children}</>;
}
