import { Carousel } from 'components/molecules/Carousel';
import { CollectionCard } from 'global/CollectionCard';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsCarousel(props: IProps) {
	function getCollections() {
		return props.collections.map((collection: any) => {
			return <CollectionCard collection={collection} height={450}></CollectionCard>;
		});
	}

	return (
		<S.Wrapper>
			{props.collections && <Carousel title={language.collections} data={getCollections()} />}
			{!props.collections && <S.Loader></S.Loader>}
		</S.Wrapper>
	);
}
