import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionCard } from 'components/organisms/CollectionCard';
import { getCollection } from 'gql';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';

export default function Collection() {
	const { id } = useParams();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [collection, setCollection] = React.useState<CollectionType | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (id) {
				setAssets(null);
				setCollection(null);
				setLoading(true);

				const collectionFetch = await getCollection({
					collectionId: id,
					filterListings: false,
					activeSort: 'low-to-high',
				});
				setCollection(collectionFetch);
				setLoading(false);
			}
		})();
	}, [id]);

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
					getFeaturedData={false}
					showFilters={true}
					autoLoadRenderers
				/>
			</div>
		</>
	);
}
