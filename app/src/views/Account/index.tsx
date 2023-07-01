import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';
import { WalletBlock } from 'wallet/WalletBlock';

import { AccountHeader } from './AccountHeader';

export default function Account() {
	const arProvider = useArweaveProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

	const [showWalletBlock, setShowWalletBlock] = React.useState<boolean>(false);

	React.useEffect(() => {
		setTimeout(() => {
			if (!arProvider.walletAddress) {
				setShowWalletBlock(true);
			}
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (assetsReducer.accountData) {
			setAssets(assetsReducer.accountData);
			setLoading(false)
		}
		else {
			setLoading(true)
		}
	}, [arProvider.walletAddress, assetsReducer.accountData]);

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
				loading={loading}
			/>
		</>
	) : (
		showWalletBlock && (
			<div className={'background-wrapper'}>
				<div className={'view-wrapper max-cutoff'}>
					<WalletBlock />
				</div>
			</div>
		)
	);
}
