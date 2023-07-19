import { useNavigate } from 'react-router-dom';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Carousel } from 'components/molecules/Carousel';
import { CollectionCard } from 'global/CollectionCard';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsCarousel(props: IProps) {
	const navigate = useNavigate();

	function getCollections() {
		return props.collections.map((collection: any, index: number) => {
			return <CollectionCard key={index} collection={collection} />;
		});
	}

	function getData() {
		if (props.collections) {
			return (
				<S.CarouselWrapper>
					<Carousel title={language.collections} data={getCollections()} />
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
				<S.CardLoader>
					<Loader placeholder />
				</S.CardLoader>
			);
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
