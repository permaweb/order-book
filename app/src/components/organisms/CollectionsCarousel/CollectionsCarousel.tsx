import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CollectionType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Carousel } from 'components/molecules/Carousel';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { CollectionsSortType } from 'helpers/types';
import * as urls from 'helpers/urls';

import { CollectionCard } from '../CollectionCard';
import { CollectionsSort } from '../CollectionsSort';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsCarousel(props: IProps) {
	const navigate = useNavigate();

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);
	const [currentSort, setCurrentSort] = React.useState<CollectionsSortType>('new');

	React.useEffect(() => {
		(async function () {
			if (props.collections) {
				setCollections(null);
				const sortedCollections = sortCollections([...props.collections]);
				setCollections(sortedCollections);
			}
		})();
	}, [props.collections, currentSort]);

	function sortCollections(collectionsArg: CollectionType[]) {
		switch (currentSort) {
			case 'new':
				const timeSortedCollections = collectionsArg.sort(
					(a: CollectionType, b: CollectionType) => b.block.timestamp - a.block.timestamp
				);
				return timeSortedCollections;
			case 'stamps':
				const stampSortedCollections = collectionsArg.sort(
					(a: CollectionType, b: CollectionType) => b.stamps.total - a.stamps.total
				);
				return stampSortedCollections;
			default:
				return collectionsArg;
		}
	}

	function getCollections() {
		return collections.map((collection: any, index: number) => {
			return <CollectionCard key={index} collection={collection} />;
		});
	}

	function getStampSortDisabled() {
		if (!collections) return true;
		for (let i = 0; i < collections.length; i++) {
			if (collections[i].stamps) return false;
		}
		return true;
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
									stampDisabled={getStampSortDisabled()}
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
