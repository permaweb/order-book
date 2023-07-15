import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';

import { AccountHeader } from './AccountHeader';

export default function Account() {
	const { id } = useParams();
	const orProvider = useOrderBookProvider();

	const arProvider = useArweaveProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [profile, setProfile] = React.useState<any>();

	React.useEffect(() => {
		orProvider.orderBook.api.getProfile({ walletAddress: id }).then(setProfile);
	}, [id]);

	React.useEffect(() => {
		if (assetsReducer.accountData) {
			setAssets(assetsReducer.accountData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [arProvider.walletAddress, assetsReducer.accountData]);

	return (
		<>
			<AccountHeader profile={profile} />
			<AssetsTable
				address={id}
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
	);
}
