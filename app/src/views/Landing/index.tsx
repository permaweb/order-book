import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsTable } from 'global/AssetsTable';
import { CollectionsCarousel } from 'global/CollectionsCarousel';
import { FEATURE_COUNT } from 'helpers/config';
import { language } from 'helpers/language';
import { REDUX_TABLES } from 'helpers/redux';
import { rankCollections } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);
	const orProvider = useOrderBookProvider();

	const [loading, setLoading] = React.useState<boolean>(false);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [tableAssets, setTableAssets] = React.useState<AssetType[] | null>(null);
	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);

	React.useEffect(() => {
		if (orProvider.orderBook) {
			(async function () {
				let collectionsFetch = await orProvider.orderBook.api.getCollections({ cursor: null });
				let collections = await rankCollections(
					collectionsFetch.collections,
					orProvider.orderBook.env.arClient.warpDefault,
					orProvider.orderBook.env.arClient.arweavePost
				);
				setCollections(collections);
			})();
		}
	}, [orProvider.orderBook]);

	React.useEffect(() => {
		if (assetsReducer.featuredData) {
			setFeaturedAssets(assetsReducer.featuredData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.contractData]);

	React.useEffect(() => {
		if (assetsReducer.contractData) {
			setTableAssets(assetsReducer.contractData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.contractData]);

	return (
		<>
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
						loading={false}
					/>
				</div>
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
			/>
		</>
	);
}
