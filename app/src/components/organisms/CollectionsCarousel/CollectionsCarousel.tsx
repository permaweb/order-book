import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CollectionType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Carousel } from 'components/molecules/Carousel';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { CollectionsSortType } from 'helpers/types';
import * as urls from 'helpers/urls';
import { rankData } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';

import { CollectionCard } from '../CollectionCard';
import { CollectionsSort } from '../CollectionsSort';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsCarousel(props: IProps) {
	const navigate = useNavigate();

	const orProvider = useOrderBookProvider();
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);
	const [currentSort, setCurrentSort] = React.useState<CollectionsSortType>('new');

	React.useEffect(() => {
		(async function () {
			if (props.collections) {
				setCollections(null);
				setCollections(await sortCollections(props.collections));
			}
		})();
	}, [props.collections, currentSort]);

	async function sortCollections(collections: CollectionType[]) {
		switch (currentSort) {
			case 'new':
				const sortedCollections = collections.sort(
					(a: CollectionType, b: CollectionType) => b.block.timestamp - a.block.timestamp
				);
				return sortedCollections;
			case 'stamps':
				if (orProvider.orderBook) {
					const collectionsFetch = await orProvider.orderBook.api.getCollections({ cursor: null });
					return await rankData(
						collectionsFetch.collections,
						orProvider.orderBook.env.arClient.warpDefault,
						orProvider.orderBook.env.arClient.arweavePost,
						window.arweaveWallet,
						dreReducer.source
					);
				} else {
					return collections;
				}
			default:
				return collections;
		}
	}

	function getCollections() {
		return collections.map((collection: any, index: number) => {
			return <CollectionCard key={index} collection={collection} />;
		});
	}

	function getData() {
		if (collections) {
			if (collections.length > 0) {
				return (
					<S.CarouselWrapper>
						<Carousel
							title={language.collections}
							data={getCollections()}
							action={
								<CollectionsSort
									currentSort={currentSort}
									setCurrentSort={(sort: CollectionsSortType) => setCurrentSort(sort)}
								/>
							}
						/>
						<S.CollectionsRedirect>
							<Button
								type={'primary'}
								label={language.viewAllCollections}
								handlePress={() => navigate(urls.collections)}
								icon={ASSETS.collections}
								height={60}
								width={350}
							/>
						</S.CollectionsRedirect>
					</S.CarouselWrapper>
				);
			} else {
				return (
					<div className={'max-cutoff'}>
						<S.NoCollectionsContainer>
							<p>{language.noCollections}</p>
						</S.NoCollectionsContainer>
					</div>
				);
			}
		} else {
			return (
				<S.CardLoader>
					<Loader placeholder />
				</S.CardLoader>
			);
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
