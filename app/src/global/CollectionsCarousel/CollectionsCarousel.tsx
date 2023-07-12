import { Carousel } from 'components/molecules/Carousel';
import * as S from './styles';
import { IProps } from './types';
import { language } from 'helpers/language';
import { CollectionCard } from 'global/CollectionCard';

export default function CollectionsCarousel(props: IProps) {
	function getCollections() {
		return props.collections.map((collection: any) => {
			return <CollectionCard collection={collection} height={700}></CollectionCard>;
		});
	}

	return (
		<S.Wrapper>
			{props.collections && <Carousel title={language.collections} data={getCollections()} />}
			{!props.collections && <S.Loader></S.Loader>}
		</S.Wrapper>
	);
}
