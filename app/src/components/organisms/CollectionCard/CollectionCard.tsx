import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { getTxEndpoint } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { StampWidget } from 'components/organisms/StampWidget';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import { formatPrice } from 'helpers/utils';

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

	function getCreator() {
		if (props.collection && props.collection.creator) {
			return (
				<S.IFlex>
					<p>{language.createdBy}</p>
					<OwnerInfo
						owner={props.collection.creator}
						asset={null}
						isSaleOrder={false}
						handleUpdate={() => {}}
						loading={false}
						hideOrderCancel={false}
					/>
				</S.IFlex>
			);
		} else {
			return null;
		}
	}

	function getFloorPrice() {
		if (props.collection.floorPrice !== null) {
			if (props.collection.floorPrice > 0) {
				return (
					<S.FPWrapper>
						<p>{`${language.floorPrice}:`}</p>
						&nbsp;
						<S.FPContainer>
							<p>{formatPrice(props.collection.floorPrice)}</p>
							<ReactSVG src={ASSETS.u} />
						</S.FPContainer>
					</S.FPWrapper>
				);
			} else {
				return (
					<S.FPWrapper>
						<p>{language.noListings}</p>
					</S.FPWrapper>
				);
			}
		} else return null;
	}

	function getData() {
		if (props.collection) {
			const redirect = `${urls.collection}${props.collection.id}`;
			return (
				<S.CollectionCard key={props.collection.id}>
					<S.InfoWrapper>
						<h2>{props.collection.title}</h2>
						{getCreator()}
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
						<S.SWrapper>
							{getFloorPrice()}
							<S.StampWidget>
								<StampWidget
									assetId={props.collection.id}
									title={props.collection.title}
									stamps={props.collection.stamps ? props.collection.stamps : null}
									hasStampedMessage={language.collectionStamped}
									getCount={props.getStampCount ? props.getStampCount : false}
								/>
							</S.StampWidget>
						</S.SWrapper>
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
