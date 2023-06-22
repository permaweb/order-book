import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsList } from 'global/AssetsList';
import { FEATURE_COUNT } from 'helpers/config';
import { ReduxAssetsUpdate } from 'state/assets/ReduxAssetsUpdate';
import { RootState } from 'state/store';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [remainingAssets, setRemainingAssets] = React.useState<AssetType[] | null>(null);

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
				setRemainingAssets(assets.slice(FEATURE_COUNT));
			} else {
				setFeaturedAssets(assets);
				setRemainingAssets([]);
			}
		}
	}, [assets]);

	function getFeaturedAssets() {
		if (featuredAssets) {
			return (
				<div className={'background-wrapper'}>
					<div className={'view-wrapper max-cutoff'}>
						<AssetsGrid assets={featuredAssets} />
					</div>
				</div>
			);
		}
	}

	function getRemainingAssets() {
		if (remainingAssets) {
			return <AssetsList assets={remainingAssets} />;
		}
	}

	return (
		<ReduxAssetsUpdate>
			{getFeaturedAssets()}
			{getRemainingAssets()}
		</ReduxAssetsUpdate>
	);
}
