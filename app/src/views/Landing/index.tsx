import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsTable } from 'global/AssetsTable';
import { FEATURE_COUNT } from 'helpers/config';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';
import { CollectionsCarousel } from 'global/CollectionsCarousel';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [tableAssets, setTableAssets] = React.useState<AssetType[] | null>(null);

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
					<CollectionsCarousel/>
				</div>
				<div className={'view-wrapper max-cutoff'}>
					<AssetsGrid assets={featuredAssets} autoLoad={true} loaderCount={FEATURE_COUNT} loading={false} />
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
