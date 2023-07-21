import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { CollectionCard } from 'global/CollectionCard';
import { REDUX_TABLES } from 'helpers/redux';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
// import * as cursorActions from 'store/cursors/actions';

export default function Collection() {
	const { id } = useParams();
	const dispatch = useDispatch();

	const orProvider = useOrderBookProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [collection, setCollection] = React.useState<CollectionType | null>(null);

	React.useEffect(() => {
		dispatch(assetActions.setAssets({ collectionData: null }));
		// dispatch(cursorActions.setCursors({ idGQL: { [REDUX_TABLES.collectionAssets]: [] } }));
	}, [id]);

	React.useEffect(() => {
		(async function () {
			if (id && orProvider.orderBook) {
				setAssets(null);
				setLoading(true);
				const collectionFetch = await orProvider.orderBook.api.getCollection({ collectionId: id });
				setCollection(collectionFetch);
				setLoading(false);
			}
		})();
	}, [id, orProvider.orderBook]);

	React.useEffect(() => {
		if (assetsReducer.collectionData) {
			setAssets(assetsReducer.collectionData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.collectionData, collection]);

	return (
		<>
			<div className={'background-wrapper'}>
				<div className={'view-wrapper max-cutoff'}>
					<CollectionCard collection={collection} hideRedirect getStampCount />
				</div>
				<AssetsTable
					collectionId={id}
					assets={assets}
					apiFetch={'collection'}
					reduxCursor={REDUX_TABLES.collectionAssets}
					recordsPerPage={PAGINATOR}
					showPageNumbers={false}
					tableType={'grid'}
					showNoResults={true}
					loading={loading}
				/>
			</div>
		</>
	);
}
