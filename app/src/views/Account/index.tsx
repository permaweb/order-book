import React from 'react';

import * as OrderBook from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { WalletBlock } from 'wallet/WalletBlock';

export default function Account() {
	const arProvider = useArweaveProvider();

	const [showWalletBlock, setShowWalletBlock] = React.useState<boolean>(false);

	const [data, setData] = React.useState<OrderBook.AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		setTimeout(() => {
			if (!arProvider.walletAddress) {
				setShowWalletBlock(true);
			}
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				setLoading(true);
				setData(await OrderBook.getAssetsByUser({ walletAddress: arProvider.walletAddress }));
				setLoading(false);
			}
		})();
	}, [arProvider.walletAddress]);

	function getData() {
		if (data) {
			return (
				<>
					{data.map((asset: OrderBook.AssetType, index: number) => {
						return <p key={index}>{asset.data.id}</p>;
					})}
				</>
			);
		} else {
			return loading ? <Loader /> : null;
		}
	}

	return arProvider.walletAddress ? (
		<div className={'view-wrapper max-cutoff'}>{getData()}</div>
	) : (
		showWalletBlock && <WalletBlock />
	);
}
