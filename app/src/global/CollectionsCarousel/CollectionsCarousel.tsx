import { Loader } from 'components/atoms/Loader';
import { Carousel } from 'components/molecules/Carousel';
import { CollectionCard } from 'global/CollectionCard';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsCarousel(props: IProps) {
	function getCollections() {
		return props.collections.map((collection: any, index: number) => {
			return <CollectionCard key={index} collection={collection} />;
		});
	}

	function getData() {
		if (props.collections) {
			return <Carousel title={language.collections} data={getCollections()} />;
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
