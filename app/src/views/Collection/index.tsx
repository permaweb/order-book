import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'global/AssetsTable';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';
import { CollectionCard } from 'global/CollectionCard';


export default function Collection() {
	const { id } = useParams();
	const orProvider = useOrderBookProvider();

	const arProvider = useArweaveProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [collection, setCollection] = React.useState<CollectionType | null>(null);

	React.useEffect(() => {
		if (id) {
			
		}
	}, [id]);

	return (
		<>
		<div className={'background-wrapper'}>
				<div className={'view-wrapper max-cutoff'}>
					<CollectionCard collection={collection} hideButton={true}/>
				</div>
				<div className={'view-wrapper max-cutoff'}>
					<AssetsTable
						addr={id}
						assets={assets}
						apiFetch={'user'}
						reduxCursor={REDUX_TABLES.userAssets}
						recordsPerPage={PAGINATOR}
						showPageNumbers={false}
						tableType={'grid'}
						showNoResults={true}
						loading={loading}
					/>
				</div>
			</div>
		</>
	);
}
