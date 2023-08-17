import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsGrid } from 'components/organisms/AssetsGrid';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionsCarousel } from 'components/organisms/CollectionsCarousel';
import { FEATURE_COUNT } from 'helpers/config';
import { language } from 'helpers/language';
import { REDUX_TABLES } from 'helpers/redux';
import { rankData } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const orProvider = useOrderBookProvider();

	const [loading, setLoading] = React.useState<boolean>(false);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [tableAssets, setTableAssets] = React.useState<AssetType[] | null>(null);
	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);

	React.useEffect(() => {
		if (orProvider.orderBook) {
			(async function () {
				const collectionsFetch = await orProvider.orderBook.api.getCollections({ cursor: null });
				const collections = await rankData(
					collectionsFetch.collections,
					orProvider.orderBook.env.arClient.warpDefault,
					orProvider.orderBook.env.arClient.arweavePost,
					window.arweaveWallet,
					dreReducer.source
				);
				setCollections(collections);
			})();
		}
	}, [orProvider.orderBook, dreReducer.source]);

	React.useEffect(() => {
		if (assetsReducer.featuredData) {
			setFeaturedAssets(assetsReducer.featuredData);
			setLoading(false);
		} else {
			setFeaturedAssets(null);
			setLoading(true);
		}
	}, [assetsReducer.contractData]);

	React.useEffect(() => {
		if (assetsReducer.contractData) {
			if (featuredAssets) {
				const featuredIds = featuredAssets.map((asset: AssetType) => asset.data.id);
				setTableAssets(assetsReducer.contractData.filter((asset: AssetType) => !featuredIds.includes(asset.data.id)));
			} else {
				setTableAssets(assetsReducer.contractData);
			}
			setLoading(false);
		} else {
			setTableAssets(null);
			setLoading(true);
		}
	}, [assetsReducer.contractData, featuredAssets]);

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<CollectionsCarousel collections={collections} />
			</div>
			<div className={'view-wrapper max-cutoff'}>
				<AssetsGrid
					title={language.assets}
					assets={featuredAssets}
					autoLoad={true}
					loaderCount={FEATURE_COUNT}
					loading={loading}
				/>
			</div>
			<AssetsTable
				assets={tableAssets}
				apiFetch={'contract'}
				reduxCursor={REDUX_TABLES.contractAssets}
				recordsPerPage={PAGINATOR}
				showPageNumbers={false}
				tableType={'list'}
				showNoResults={true}
				loading={loading}
				getFeaturedData={!featuredAssets}
				showFilters={true}
			/>
		</div>
	);
}
