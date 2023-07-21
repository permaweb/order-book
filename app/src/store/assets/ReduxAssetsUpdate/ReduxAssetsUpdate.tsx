import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

import { AssetType, CursorEnum, OrderBook, OrderBookType, PAGINATOR } from 'permaweb-orderbook';

import { FEATURE_COUNT } from 'helpers/config';
import { ApiFetchType } from 'helpers/types';
import { rankData } from 'helpers/utils';
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
	address?: string;
	collectionId?: string;
}) {
	const dispatch = useDispatch();
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

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
			(async function () {
				if (props.reduxCursor && props.cursorObject && cursorsReducer[props.cursorObject]) {
					const currentReducer = cursorsReducer[props.cursorObject];
					if (currentReducer[props.reduxCursor]) {
						const updatedReducer = props.collectionId ? [] : currentReducer[props.reduxCursor];
						let contractIds: string[] = [];

						switch (props.apiFetch) {
							case 'contract':
								contractIds = await orderBook.api.getAssetIdsByContract();
								break;
							case 'user':
								if (props.address) {
									contractIds = await orderBook.api.getAssetIdsByUser({ walletAddress: props.address });
								}
								break;
							case 'collection':
								if (props.collectionId) {
									let collection = await orderBook.api.getCollection({ collectionId: props.collectionId });
									if (collection) contractIds = collection.assets;
								}
								break;
						}

						const rankedContractIds = await rankData(
							contractIds,
							orderBook.env.arClient.warpDefault,
							orderBook.env.arClient.arweavePost,
							window.arweaveWallet
						);

						const groupIndex = new Map(currentReducer[props.reduxCursor].map((group: any) => [group.index, group.ids]));

						if (rankedContractIds.length <= 0) {
							updatedReducer.push({
								index: `${props.reduxCursor}-${props.cursorObject}-0`,
								ids: [],
							});
						}

						for (let i = 0; i < rankedContractIds.length; i += PAGINATOR) {
							const cursorIds = [...rankedContractIds].slice(i, i + PAGINATOR);
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
	}, [props.address, props.collectionId, orderBook]);

	React.useEffect(() => {
		(async function () {
			const reducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (reducer && reducer.length && orderBook && props.currentTableCursor && orderBook) {
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

						const rankedAssets = await rankData(
							fetchedAssets,
							orderBook.env.arClient.warpDefault,
							orderBook.env.arClient.arweavePost,
							window.arweaveWallet
						);

						switch (props.apiFetch) {
							case 'contract':
								const finalFeaturedAssets: AssetType[] = rankedAssets.slice(0, FEATURE_COUNT);
								let finalTableAssets: AssetType[] = [];
								if (rankedAssets.length >= FEATURE_COUNT) {
									finalTableAssets = rankedAssets.slice(FEATURE_COUNT);
								}
								dispatch(assetActions.setAssets({ contractData: finalTableAssets, featuredData: finalFeaturedAssets }));
								break;
							case 'user':
								dispatch(assetActions.setAssets({ accountData: rankedAssets }));
								break;
							case 'collection':
								dispatch(assetActions.setAssets({ collectionData: rankedAssets }));
								break;
						}
					}
				}
			}
		})();
	}, [cursorsReducer, props.currentTableCursor, orderBook]);

	return <>{props.children}</>;
}
