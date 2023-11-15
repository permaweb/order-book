import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { AssetSortType, AssetType } from 'permaweb-orderbook';

import { getAssetIdsByContract, getAssetIdsByUser, getAssetsByIds, getCollection, sortAssets } from 'gql';
import { API_CONFIG, FEATURE_COUNT, GATEWAYS, PAGINATORS } from 'helpers/config';
import { APIFetchType, CursorEnum } from 'helpers/types';
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

	const [arweavePost, setArweavePost] = React.useState<any>(null);
	const [warp, setWarp] = React.useState<any>(null);

	React.useEffect(() => {
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

		setArweavePost(arweavePost);
		setWarp(warp);
	}, []);

	React.useEffect(() => {
		(async function () {
			if (props.reduxCursor && props.cursorObject && cursorsReducer[props.cursorObject] && arweavePost && warp) {
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
							contractIds = await getAssetIdsByContract({
								filterListings: props.filterListings,
								activeSort: props.activeSort,
							});
							break;
						case 'user':
							if (props.address) {
								paginator = PAGINATORS.user;
								contractIds = await getAssetIdsByUser({
									warp: warp,
									walletAddress: props.address,
									filterListings: props.filterListings,
									activeSort: props.activeSort,
								});
							}
							break;
						case 'collection':
							if (props.collectionId) {
								paginator = PAGINATORS.collection;
								const collection = await getCollection({
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

					const groupIndex = new Map(
						currentReducer[props.reduxCursor].groups.map((group: any) => [group.index, group.ids])
					);

					if (contractIds.length <= 0) {
						updatedReducer.groups.push({
							index: `${props.reduxCursor}-${props.cursorObject}-0`,
							ids: [],
						});
					} else {
						updatedReducer.featuredGroup = props.apiFetch === 'contract' ? contractIds.slice(0, FEATURE_COUNT) : [];
						const tableStampContractIds =
							props.apiFetch === 'contract' ? contractIds.slice(FEATURE_COUNT) : contractIds;

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

					updatedReducer.count = contractIds.length;
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
	}, [props.address, props.collectionId, dreReducer.source, props.filterListings, props.activeSort, arweavePost, warp]);

	React.useEffect(() => {
		(async function () {
			const cursorReducer = cursorsReducer[props.cursorObject][props.reduxCursor];
			if (cursorReducer && cursorReducer.groups.length && props.currentTableCursor && arweavePost && warp) {
				for (let i = 0; i < cursorReducer.groups.length; i++) {
					if (props.currentTableCursor === cursorReducer.groups[i].index) {
						const assets = await getAssetsByIds({
							gateway: GATEWAYS.arweave,
							ids: [...cursorReducer.featuredGroup, ...cursorReducer.groups[i].ids],
							tagFilters: null,
							owners: null,
							cursor: null,
							reduxCursor: props.reduxCursor,
							cursorObjectKey: CursorEnum.idGQL,
							activeSort: props.activeSort,
						});

						const rankByStamps = props.activeSort === 'by-stamps' || props.apiFetch === 'user';
						let stampAssets;
						try {
							stampAssets = await getStampData(assets, window.arweaveWallet, rankByStamps, dreReducer.source);
						} catch (e: any) {
							stampAssets = assets;
						}

						const featuredStampAssets = sortAssets(
							stampAssets.filter((_stampAsset, index) => cursorReducer.featuredGroup.includes(assets[index].data.id)),
							props.activeSort
						);

						const remainingStampAssets = sortAssets(
							stampAssets.filter((_stampAsset, index) => cursorReducer.groups[i].ids.includes(assets[index].data.id)),
							props.activeSort
						);

						switch (props.apiFetch) {
							case 'contract':
								let assetReducer = {};

								let finalFeaturedAssets: AssetType[];

								finalFeaturedAssets = featuredStampAssets;
								assetReducer['featuredData'] = finalFeaturedAssets;

								let finalTableAssets: AssetType[] = [];
								finalTableAssets = remainingStampAssets;
								assetReducer['contractData'] = finalTableAssets;

								dispatch(assetActions.setAssets(assetReducer));
								break;
							case 'user':
								dispatch(
									assetActions.setAssets({ accountData: { address: props.address, data: remainingStampAssets } })
								);
								break;
							case 'collection':
								dispatch(assetActions.setAssets({ collectionData: remainingStampAssets }));
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
		props.filterListings,
		props.activeSort,
		arweavePost,
		warp,
	]);

	return <>{props.children}</>;
}
