import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { REDUX_TABLES } from 'helpers/redux';
import * as windowUtils from 'helpers/window';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import * as cursorActions from 'store/cursors/actions';

import { AccountHeader } from './AccountHeader';

export default function Account() {
	const { id } = useParams();
	const dispatch = useDispatch();

	const orProvider = useOrderBookProvider();

	const [idParam, setIdParam] = React.useState<string | null>(null);

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [profile, setProfile] = React.useState<any>();

	React.useEffect(() => {
		if (id) {
			windowUtils.scrollTo(0, 0, 'smooth');
			setIdParam(id);
		}
	}, [id]);

	React.useEffect(() => {
		dispatch(
			assetActions.setAssets({
				accountData: { address: null, data: null },
			})
		);
		dispatch(
			cursorActions.setCursors({
				[REDUX_TABLES.userAssets]: [],
			})
		);
	}, [idParam]);

	React.useEffect(() => {
		if (idParam && orProvider.orderBook) {
			orProvider.orderBook.api.getProfile({ walletAddress: idParam }).then(setProfile);
		}
	}, [idParam, orProvider.orderBook]);

	React.useEffect(() => {
		if (assetsReducer.accountData && assetsReducer.accountData.data) {
			setAssets(assetsReducer.accountData.data);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.accountData]);

	return (
		<>
			<AccountHeader profile={profile} />
			<AssetsTable
				address={idParam}
				assets={assets}
				apiFetch={'user'}
				reduxCursor={REDUX_TABLES.userAssets}
				recordsPerPage={PAGINATOR}
				showPageNumbers={false}
				tableType={'grid'}
				showNoResults={true}
				loading={loading}
				getFeaturedData={false}
			/>
		</>
	);
}
