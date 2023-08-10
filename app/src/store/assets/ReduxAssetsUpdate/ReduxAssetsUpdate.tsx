import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { AssetType, CursorEnum, OrderBook, OrderBookType, PAGINATOR } from 'permaweb-orderbook';

import { API_CONFIG, CURRENCIES, FEATURE_COUNT } from 'helpers/config';
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
	getFeaturedData: boolean;
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
							groups: {
								index: string;
								ids: string[];
							}[];
							count: number;
						} = { groups: [], count: 0 };
						if (
							props.collectionId ||
							(assetsReducer.accountData.address && props.address !== assetsReducer.accountData.address)
						) {
							updatedReducer = { groups: [], count: 0 };
						} else updatedReducer = currentReducer[props.reduxCursor];

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
							window.arweaveWallet,
							dreReducer.source
						);

						const groupIndex = new Map(
							currentReducer[props.reduxCursor].groups.map((group: any) => [group.index, group.ids])
						);

						if (rankedContractIds.length <= 0) {
							updatedReducer.groups.push({
								index: `${props.reduxCursor}-${props.cursorObject}-0`,
								ids: [],
							});
						} else {
							for (let i = 0, j = 0; i < rankedContractIds.length; i += PAGINATOR, j++) {
								const cursorIds = [...rankedContractIds].slice(i, i + PAGINATOR);
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

						updatedReducer.count = rankedContractIds.length;
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
	}, [props.address, props.collectionId, dreReducer.source, orderBook]);

	React.useEffect(() => {
		(async function () {
			const cursorReducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (cursorReducer && cursorReducer.groups.length && orderBook && props.currentTableCursor && orderBook) {
				for (let i = 0; i < cursorReducer.groups.length; i++) {
					if (props.currentTableCursor === cursorReducer.groups[i].index) {
						const fetchedAssets = await orderBook.api.getAssetsByIds({
							ids: cursorReducer.groups[i].ids,
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
							window.arweaveWallet,
							dreReducer.source
						);

						switch (props.apiFetch) {
							case 'contract':
								let assetReducer = {};

								let finalFeaturedAssets: AssetType[];
								if (props.getFeaturedData) {
									finalFeaturedAssets = rankedAssets.slice(0, FEATURE_COUNT);
									assetReducer['featuredData'] = finalFeaturedAssets;
								}

								let finalTableAssets: AssetType[] = [];
								if (rankedAssets.length >= FEATURE_COUNT && props.getFeaturedData) {
									finalTableAssets = rankedAssets.slice(FEATURE_COUNT);
								} else {
									finalTableAssets = rankedAssets;
								}
								assetReducer['contractData'] = finalTableAssets;

								dispatch(assetActions.setAssets(assetReducer));
								break;
							case 'user':
								dispatch(assetActions.setAssets({ accountData: { address: props.address, data: rankedAssets } }));
								break;
							case 'collection':
								dispatch(assetActions.setAssets({ collectionData: rankedAssets }));
								break;
						}
					}
				}
			}
		})();
	}, [
		cursorsReducer[props.cursorObject][props.reduxCursor].groups,
		assetsReducer.accountData.address,
		props.currentTableCursor,
		dreReducer.source,
		orderBook,
	]);

	return <>{props.children}</>;
}
