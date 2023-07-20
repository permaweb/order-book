import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { CollectionCard } from 'global/CollectionCard';
import { REDUX_TABLES } from 'helpers/redux';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';

export default function Collection() {
	const { id } = useParams();
	const orProvider = useOrderBookProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [collection, setCollection] = React.useState<CollectionType | null>(null);

	React.useEffect(() => {
		if (id && orProvider.orderBook) {
			(async function () {
				setLoading(true);
				const collectionFetch = await orProvider.orderBook.api.getCollection({ collectionId: id });
				setCollection(collectionFetch);
				setLoading(false);
			})();
		}
	}, [id, orProvider.orderBook]);

	React.useEffect(() => {
		if (assetsReducer.collectionData) {
			setAssets(assetsReducer.collectionData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.collectionData]);

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
