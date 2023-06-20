import React from 'react';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetType, OrderBook, OrderBookType } from 'permaweb-orderbook';

import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsList } from 'global/AssetsList';
import { FEATURE_COUNT } from 'helpers/config';

export default function Landing() {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [remainingAssets, setRemainingAssets] = React.useState<AssetType[] | null>(null);

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
				wallet: 'use_wallet',
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				warp: warp,
			})
		);
	}, []);

	React.useEffect(() => {
		if (orderBook) {
			(async function () {
				setAssets(await orderBook.api.getAssetsByContract());
			})();
		}
	}, [orderBook]);

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
