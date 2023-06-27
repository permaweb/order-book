import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsTable } from 'global/AssetsTable';
import { FEATURE_COUNT } from 'helpers/config';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [tableAssets, setTableAssets] = React.useState<AssetType[] | null>(null);

	React.useEffect(() => {
		if (assetsReducer.data) {
			setAssets(assetsReducer.data);
		}
	}, [assetsReducer.data]);

	// TODO: get featured
	React.useEffect(() => {
		if (assets) {
			if (assets.length >= FEATURE_COUNT) {
				setFeaturedAssets(assets.slice(0, FEATURE_COUNT));
				setTableAssets(assets.slice(FEATURE_COUNT));
			} else {
				setFeaturedAssets(assets);
				setTableAssets([]);
			}
		}
	}, [assets]);

	return (
		<>
			<div className={'background-wrapper'}>
				<div className={'view-wrapper max-cutoff'}>
					<AssetsGrid assets={featuredAssets} autoLoad={true} />
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
			/>
		</>
	);
}
