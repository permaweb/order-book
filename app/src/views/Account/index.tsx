import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetType, OrderBook, OrderBookType, PAGINATOR } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { AssetsTable } from 'global/AssetsTable';
import { language } from 'helpers/language';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';
import { WalletBlock } from 'wallet/WalletBlock';

import { AccountHeader } from './AccountHeader';

// TODO: orderbook provider
export default function Account() {
	const arProvider = useArweaveProvider();
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [showWalletBlock, setShowWalletBlock] = React.useState<boolean>(false);

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
				walletAddress: arProvider.walletAddress,
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
		// if (assetsReducer.data) {
		// 	setAssets(assetsReducer.data);
		// }
		(async function () {
			if (arProvider.walletAddress && orderBook) {
				setLoading(true);
				setAssets(await orderBook.api.getAssetsByUser({ 
					walletAddress: arProvider.walletAddress,
					ids: null,
					owner: null,
					cursor: null,
					reduxCursor: null,
					uploader: null,
				}));
				let s = await orderBook.api.search({
					term: "Single owner Multiple supply Bazar", 
					walletAddress: arProvider.walletAddress,
					ids: null,
					owner: null,
					cursor: null,
					reduxCursor: null,
					uploader: null
				});
				setLoading(false);
			}
		})();
	}, [arProvider.walletAddress, orderBook]);

	// function getAssetsTable() {
	// 	if (assets) {
	// 		return (
	// 			<AssetsTable
	// 				assets={assets}
	// 				cursors={{
	// 					next: null,
	// 					previous: null,
	// 				}}
	// 				handleCursorFetch={(cursor: string | null) => console.log(cursor)}
	// 				header={language.myAssets}
	// 				recordsPerPage={PAGINATOR}
	// 				showPageNumbers={false}
	// 				tableType={'grid'}
	// 				showNoResults={true}
	// 			/>
	// 		);
	// 	} else {
	// 		if (loading) {
	// 			return <Loader />;
	// 		} else return null;
	// 	}
	// }, [assetsReducer.data]);

	// React.useEffect(() => {
	// 	(async function () {
	// 		if (arProvider.walletAddress && orderBook) {
	// 			setLoading(true);
	// 			setAssets(
	// 				await orderBook.api.getAssetsByUser({
	// 					ids: null,
	// 					owner: null,
	// 					uploader: null,
	// 					cursor: null,
	// 					reduxCursor: null,
	// 					walletAddress: arProvider.walletAddress,
	// 				})
	// 			);
	// 			setLoading(false);
	// 		}
	// 	})();
	// }, [arProvider.walletAddress, orderBook]);

	// function getAssetsTable() {
	// 	if (assets) {
	// 		return (
	// 			<AssetsTable
	// 				assets={assets}
	// 				cursors={{
	// 					next: null,
	// 					previous: null,
	// 				}}
	// 				handleCursorFetch={(cursor: string | null) => console.log(cursor)}
	// 				header={language.myAssets}
	// 				recordsPerPage={PAGINATOR}
	// 				showPageNumbers={false}
	// 				tableType={'grid'}
	// 				showNoResults={true}
	// 			/>
	// 		);
	// 	} else {
	// 		if (loading) {
	// 			return <Loader />;
	// 		} else return null;
	// 	}
	// }

	return arProvider.walletAddress ? (
		<>
			<AccountHeader />
			<AssetsTable
				assets={assets}
				apiFetch={'user'}
				reduxCursor={REDUX_TABLES.userAssets}
				recordsPerPage={PAGINATOR}
				showPageNumbers={false}
				tableType={'grid'}
				showNoResults={true}
			/>
		</>
	) : (
		showWalletBlock && <WalletBlock />
	);
}
