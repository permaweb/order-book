import { useNavigate } from 'react-router-dom';

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
			if (props.collection.banner.length === 43 && !props.collection.banner.includes('https://'))
				return getTxEndpoint(props.collection.banner);
			else return props.collection.banner;
		} else {
			return 'https://e73ghewv225e3v7fkxi4qrrtgr4lq7f2z3rusb63mu6plaxynogq.arweave.net/J_ZjktXWuk3X5VXRyEYzNHi4fLrO40kH22U89YL4a40';
		}
	}

	function getData() {
		if (props.collection) {
			return (
				<S.CollectionCard key={props.collection.id}>
					<S.InfoWrapper>
						<h2>{props.collection.title}</h2>
						<p>{props.collection.author.handle}</p>
						{!props.hideButton && (
							<S.ButtonWrapper>
								<Button
									type={'primary'}
									label={language.viewCollection}
									handlePress={() => navigate(`${urls.collection}${props.collection.id}`)}
									disabled={false}
									loading={false}
									icon={ASSETS.details}
									height={45}
									width={200}
								/>
							</S.ButtonWrapper>
						)}
						<S.StampWidget>
							<StampWidget assetId={props.collection.id} title={props.collection.title} stamps={null}></StampWidget>
						</S.StampWidget>
					</S.InfoWrapper>
					<S.ImageWrapper backgroundImage={getBanner()}></S.ImageWrapper>
				</S.CollectionCard>
			);
		} else return <Loader placeholder />;
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
