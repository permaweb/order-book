import { useNavigate } from 'react-router-dom';

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

	function getData() {
		if (props.collection) {
			return (
				<S.CollectionCard key={props.collection.id}>
					<S.InfoWrapper>
						<h2>{props.collection.title}</h2>
						<p>
							{props.collection.author.handle}
						</p>
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
					<S.ImageWrapper backgroundImage={props.collection.banner}></S.ImageWrapper>
				</S.CollectionCard>
			)
		}
		else return <Loader placeholder />
	}

	return (
		<S.Wrapper>
			{getData()}
		</S.Wrapper>
	)
}
