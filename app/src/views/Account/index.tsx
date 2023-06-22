import React from 'react';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetType, OrderBook, OrderBookType } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { WalletBlock } from 'wallet/WalletBlock';

import { AccountDetail } from './AccountDetail';
import { AccountHeader } from './AccountHeader';

// TODO: orderbook provider
export default function Account() {
	const arProvider = useArweaveProvider();

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [showWalletBlock, setShowWalletBlock] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

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
				walletAddress: arProvider.walletAddress
			})
		);
	}, []);

	React.useEffect(() => {
		setTimeout(() => {
			if (!arProvider.walletAddress) {
				setShowWalletBlock(true);
			}
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress && orderBook) {
				setLoading(true);
				setAssets(await orderBook.api.getAssetsByUser({ walletAddress: arProvider.walletAddress }));
				setLoading(false);
			}
		})();
	}, [arProvider.walletAddress, orderBook]);

	return arProvider.walletAddress ? (
		<>
			<AccountHeader />
			<AccountDetail assets={assets} />
		</>
	) : (
		showWalletBlock && <WalletBlock />
	);
}
