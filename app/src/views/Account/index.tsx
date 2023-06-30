import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';
import { WalletBlock } from 'wallet/WalletBlock';

import { AccountHeader } from './AccountHeader';

export default function Account() {
	const dispatch = useDispatch();

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
		dispatch(assetActions.setAssets({ accountData: null }));
		dispatch(
			cursorActions.setCursors({
				idGQL: {
					[REDUX_TABLES.contractAssets]: [],
					[REDUX_TABLES.userAssets]: [],
				},
			})
		);
	}, []);

	React.useEffect(() => {
		if (assetsReducer.accountData) {
			setAssets(assetsReducer.accountData);
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
			/>
		</>
	) : (
		showWalletBlock && <WalletBlock />
	);
}
