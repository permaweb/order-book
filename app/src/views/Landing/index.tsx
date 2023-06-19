import React from 'react';

import { AssetType, getAssetsByContract } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsList } from 'global/AssetsList';
import { FEATURE_COUNT } from 'helpers/config';

export default function Landing() {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [remainingAssets, setRemainingAssets] = React.useState<AssetType[] | null>(null);

	React.useEffect(() => {
		(async function () {
			setAssets(await getAssetsByContract());
		})();
	}, []);

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
			return <AssetsGrid assets={featuredAssets} />;
		}
	}

	function getRemainingAssets() {
		if (remainingAssets) {
			return <AssetsList assets={remainingAssets} />;
		}
	}

	return (
		<>
			{getFeaturedAssets()}
			{getRemainingAssets()}
		</>
	);
}
