import React from 'react';

import { CollectionType } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { CollectionsTable } from 'global/CollectionsTable';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

export default function Collections() {
	const orProvider = useOrderBookProvider();

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);

	React.useEffect(() => {
		if (orProvider.orderBook) {
			(async function () {
				const collectionsFetch = await orProvider.orderBook.api.getCollections();
				setCollections(collectionsFetch);
			})();
		}
	}, [orProvider.orderBook]);

	function getData() {
		if (collections) {
			return <CollectionsTable collections={collections} />;
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
