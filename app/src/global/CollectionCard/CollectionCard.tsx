import { Link, useNavigate } from 'react-router-dom';

import { getTxEndpoint } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { StampWidget } from 'global/StampWidget';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionCard(props: IProps) {
	const navigate = useNavigate();

	function getBanner() {
		if (props.collection.banner) {
			if (props.collection.banner.length === 43) return getTxEndpoint(props.collection.banner);
			else return props.collection.banner;
		} else {
			return ASSETS.defaultCollection;
		}
	}

	function getData() {
		if (props.collection) {
			const redirect = `${urls.collection}${props.collection.id}`;
			return (
				<S.CollectionCard key={props.collection.id}>
					<S.InfoWrapper>
						<h2>{props.collection.title}</h2>
						{props.collection.author.handle && <p>{`${language.createdBy} ${props.collection.author.handle}`}</p>}
						{!props.hideRedirect && (
							<S.ButtonWrapper>
								<Button
									type={'primary'}
									label={language.viewCollection}
									handlePress={() => navigate(redirect)}
									disabled={false}
									loading={false}
									icon={ASSETS.details}
									height={45}
									width={200}
								/>
							</S.ButtonWrapper>
						)}
						<S.StampWidget>
							<StampWidget
								assetId={props.collection.id}
								title={props.collection.title}
								stamps={props.collection.stamps ? props.collection.stamps : null}
								getCount={props.getStampCount ? props.getStampCount : false}
							></StampWidget>
						</S.StampWidget>
					</S.InfoWrapper>
					{!props.hideRedirect && (
						<S.ImageLink>
							<Link to={redirect} />
						</S.ImageLink>
					)}
					<S.ImageWrapper backgroundImage={getBanner()}></S.ImageWrapper>
				</S.CollectionCard>
			);
		} else return <Loader placeholder />;
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
