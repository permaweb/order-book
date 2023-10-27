import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { AssetSortType, AssetType, CursorEnum, OrderBook, OrderBookType } from 'permaweb-orderbook';

import { API_CONFIG, CURRENCIES, FEATURE_COUNT, PAGINATORS } from 'helpers/config';
import { APIFetchType } from 'helpers/types';
import { getStampData } from 'helpers/utils';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';

LoggerFactory.INST.logLevel('fatal');

export default function ReduxAssetsUpdate(props: {
	reduxCursor: string;
	apiFetch: APIFetchType;
	cursorObject: CursorEnum;
	currentTableCursor: string | null;
	children: React.ReactNode;
	address?: string;
	collectionId?: string;
	getFeaturedData: boolean;
	filterListings: boolean;
	activeSort: AssetSortType;
}) {
	const dispatch = useDispatch();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

	React.useEffect(() => {
		const arweaveGet = Arweave.init({
			host: API_CONFIG.arweaveGet,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		const arweavePost = Arweave.init({
			host: API_CONFIG.arweavePost,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		const warp = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		}).use(new DeployPlugin());

		setOrderBook(
			OrderBook.init({
				currency: CURRENCIES.default,
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				bundlrKey: null,
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
						let contractIds: string[] = [];

						let updatedReducer: {
							featuredGroup: string[];
							groups: {
								index: string;
								ids: string[];
							}[];
							count: number;
						} = { featuredGroup: [], groups: [], count: 0 };
						if (
							props.collectionId ||
							(assetsReducer.accountData.address && props.address !== assetsReducer.accountData.address)
						) {
							updatedReducer = { featuredGroup: [], groups: [], count: 0 };
						} else updatedReducer = currentReducer[props.reduxCursor];

						let paginator = PAGINATORS.default;
						switch (props.apiFetch) {
							case 'contract':
								paginator = PAGINATORS.contract;
								contractIds = await orderBook.api.getAssetIdsByContract({
									filterListings: props.filterListings,
									activeSort: props.activeSort,
								});
								break;
							case 'user':
								if (props.address) {
									paginator = PAGINATORS.user;
									contractIds = await orderBook.api.getAssetIdsByUser({
										walletAddress: props.address,
										filterListings: props.filterListings,
										activeSort: props.activeSort,
									});
								}
								break;
							case 'collection':
								if (props.collectionId) {
									paginator = PAGINATORS.collection;
									const collection = await orderBook.api.getCollection({
										collectionId: props.collectionId,
										filterListings: props.filterListings,
										activeSort: props.activeSort,
									});
									if (collection) {
										contractIds = collection.assets;
									}
								}
								break;
						}

						const rankByStamps = props.activeSort === 'by-stamps' || props.apiFetch === 'user';

						const stampContractIds = await getStampData(
							contractIds,
							orderBook.env.arClient.warpDefault,
							orderBook.env.arClient.arweavePost,
							window.arweaveWallet,
							rankByStamps,
							dreReducer.source
						);

						const groupIndex = new Map(
							currentReducer[props.reduxCursor].groups.map((group: any) => [group.index, group.ids])
						);

						if (stampContractIds.length <= 0) {
							updatedReducer.groups.push({
								index: `${props.reduxCursor}-${props.cursorObject}-0`,
								ids: [],
							});
						} else {
							updatedReducer.featuredGroup =
								props.apiFetch === 'contract' ? stampContractIds.slice(0, FEATURE_COUNT) : [];
							const tableStampContractIds =
								props.apiFetch === 'contract' ? stampContractIds.slice(FEATURE_COUNT) : stampContractIds;

							for (let i = 0, j = 0; i < tableStampContractIds.length; i += paginator, j++) {
								const cursorIds = [...tableStampContractIds].slice(i, i + paginator);
								const newIndex = `${props.reduxCursor}-${props.cursorObject}-${j}`;

								if (
									![...groupIndex.values()].some((ids: any) =>
										ids.every((id: any, index: any) => id === cursorIds[index])
									) ||
									newIndex === `${props.reduxCursor}-${props.cursorObject}-0`
								) {
									updatedReducer.groups.push({
										index: newIndex,
										ids: cursorIds,
									});
								}
							}
						}

						updatedReducer.count = stampContractIds.length;
						dispatch(
							cursorActions.setCursors({
								[props.cursorObject]: {
									[props.reduxCursor]: updatedReducer,
								},
							})
						);
					}
				}
			})();
		}
	}, [props.address, props.collectionId, dreReducer.source, orderBook, props.filterListings, props.activeSort]);

	React.useEffect(() => {
		(async function () {
			console.log('---');
			const cursorReducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (cursorReducer && cursorReducer.groups.length && orderBook && props.currentTableCursor && orderBook) {
				for (let i = 0; i < cursorReducer.groups.length; i++) {
					if (props.currentTableCursor === cursorReducer.groups[i].index) {
						const featuredAssets = await orderBook.api.getAssetsByIds({
							ids: cursorReducer.featuredGroup,
							owner: null,
							uploader: null,
							cursor: null,
							reduxCursor: props.reduxCursor,
							walletAddress: null,
							activeSort: props.activeSort,
						});

						const fetchedAssets = await orderBook.api.getAssetsByIds({
							ids: cursorReducer.groups[i].ids,
							owner: null,
							uploader: null,
							cursor: null,
							reduxCursor: props.reduxCursor,
							walletAddress: null,
							activeSort: props.activeSort,
						});

						const rankByStamps = props.activeSort === 'by-stamps' || props.apiFetch === 'user';

						const featuredStampAssets = await getStampData(
							featuredAssets,
							orderBook.env.arClient.warpDefault,
							orderBook.env.arClient.arweavePost,
							window.arweaveWallet,
							rankByStamps,
							dreReducer.source
						);

						const stampAssets = await getStampData(
							fetchedAssets,
							orderBook.env.arClient.warpDefault,
							orderBook.env.arClient.arweavePost,
							window.arweaveWallet,
							rankByStamps,
							dreReducer.source
						);

						switch (props.apiFetch) {
							case 'contract':
								let assetReducer = {};

								let finalFeaturedAssets: AssetType[];
								if (props.getFeaturedData) {
									finalFeaturedAssets = featuredStampAssets;
									assetReducer['featuredData'] = finalFeaturedAssets;
								}

								let finalTableAssets: AssetType[] = [];
								finalTableAssets = stampAssets;
								assetReducer['contractData'] = finalTableAssets;

								dispatch(assetActions.setAssets(assetReducer));
								break;
							case 'user':
								dispatch(assetActions.setAssets({ accountData: { address: props.address, data: stampAssets } }));
								break;
							case 'collection':
								dispatch(assetActions.setAssets({ collectionData: stampAssets }));
								break;
						}
					}
				}
			}
		})();
	}, [
		cursorsReducer,
		assetsReducer.accountData.address,
		props.currentTableCursor,
		dreReducer.source,
		orderBook,
		props.filterListings,
		props.activeSort,
	]);

	return <>{props.children}</>;
}
