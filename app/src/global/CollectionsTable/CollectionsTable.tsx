import { Link } from 'react-router-dom';

import { CollectionType } from 'permaweb-orderbook';

import { StampWidget } from 'global/StampWidget';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

// TODO: get stamp counts
function CollectionRow(props: { collection: CollectionType; index: number }) {
	const redirect = `${urls.collection}${props.collection.id}`;

	return (
		<S.PICWrapper>
			<S.PCWrapper>
				<S.AFlex>
					<p>{props.index}</p>
					<S.AWrapper>
						<S.CollectionLink>
							<Link to={redirect} />
						</S.CollectionLink>
						<S.ThumbnailWrapper>
							<img src={props.collection.thumbnail} />
						</S.ThumbnailWrapper>
					</S.AWrapper>
					<S.ATitle>
						<Link to={redirect}>{props.collection.name}</Link>
					</S.ATitle>
				</S.AFlex>
				<S.SFlex>
					<S.SCValue>
						<StampWidget assetId={props.collection.name} title={props.collection.name} stamps={null} />
					</S.SCValue>
				</S.SFlex>
			</S.PCWrapper>
		</S.PICWrapper>
	);
}

export default function CollectionsTable(props: IProps) {
	return props.collections ? (
		<S.Wrapper>
			<S.Header>
				<p>{language.collections.toUpperCase()}</p>
			</S.Header>
			<S.Body>
				<>
					<S.HSection1>
						<S.Rank>
							<p>{language.rank}</p>
						</S.Rank>
						<S.Collection>
							<p>{language.collection}</p>
						</S.Collection>
						<S.SHeaderFlex>
							<S.StampCount>
								<p>{language.stampCount}</p>
							</S.StampCount>
						</S.SHeaderFlex>
					</S.HSection1>

					{props.collections.map((collection: CollectionType, index: number) => {
						return <CollectionRow key={index} collection={collection} index={index + 1} />;
					})}
				</>
			</S.Body>
		</S.Wrapper>
	) : null;
}
