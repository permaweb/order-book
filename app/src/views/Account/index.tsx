import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
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

	const [showWalletBlock, setShowWalletBlock] = React.useState<boolean>(false);

	React.useEffect(() => {
		setTimeout(() => {
			if (!arProvider.walletAddress) {
				setShowWalletBlock(true);
			}
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (assetsReducer.data) {
			setAssets(assetsReducer.data);
		}
	}, [arProvider.walletAddress, assetsReducer.data]);

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
