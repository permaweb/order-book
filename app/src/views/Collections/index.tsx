import React from 'react';

import { CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { CollectionsTable } from 'global/CollectionsTable';
import { REDUX_TABLES } from 'helpers/redux';
import { collectionsRank } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

export default function Collections() {
	const orProvider = useOrderBookProvider();

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);

	React.useEffect(() => {
		if (orProvider.orderBook) {
			(async function () {
				let collectionsFetch = await orProvider.orderBook.api.getCollections();
				let collections = await collectionsRank(
					collectionsFetch,
					orProvider.orderBook.env.arClient.warpDefault,
					orProvider.orderBook.env.arClient.arweavePost
				);
				setCollections(collections);
			})();
		}
	}, [orProvider.orderBook]);

	function getData() {
		if (collections) {
			return (
				<CollectionsTable
					collections={collections}
					recordsPerPage={PAGINATOR}
					reduxCursor={REDUX_TABLES.collectionAssets}
					showPageNumbers={false}
				/>
			);
		} else {
			return <Loader />;
		}
	}

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>{getData()}</div>
		</div>
	);
}
