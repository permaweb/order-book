import { useNavigate } from 'react-router-dom';

import * as S from './styles';
import { IProps } from './types';
import { language } from 'helpers/language';
import { ASSETS } from 'helpers/config';
import { Button } from 'components/atoms/Button';
import { StampWidget } from 'global/StampWidget';
import * as urls from 'helpers/urls';
import { formatAddress } from 'helpers/utils';

export default function CollectionsCard(props: IProps) {
	const navigate = useNavigate();

	if (props.collection) {
		return (
			<S.CollectionCard key={props.collection.id} height={props.height}>
				<S.CollectionCardImage backgroundImage={props.collection.banner} buttonHidden={props.hideButton} />
				<S.CollectionCardDetails buttonHidden={props.hideButton}>
					<S.CollectionCardLabel>
						<S.CollectionCardLabelThumb backgroundImage={props.collection.thumbnail} />
						<S.CollectionCardLabelInfo>
							<S.CollectionCardLabelInfoCollection>{props.collection.title}</S.CollectionCardLabelInfoCollection>
							<S.CollectionCardLabelInfoAuthor>
								by {props.collection.author.handle} {formatAddress(props.collection.author.address, true)}
							</S.CollectionCardLabelInfoAuthor>
						</S.CollectionCardLabelInfo>
					</S.CollectionCardLabel>
					<S.CollectionCardStamps>
						<StampWidget assetId={props.collection.id} title={props.collection.title} stamps={null}></StampWidget>
					</S.CollectionCardStamps>
				</S.CollectionCardDetails>
				{!props.hideButton && (
					<S.ButtonWrapper>
						<Button
							type={'alt2'}
							label={language.viewCollection}
							handlePress={() => navigate(`${urls.collection}${props.collection.id}`)}
							fullWidth
							disabled={false}
							loading={false}
							icon={ASSETS.details}
						/>
					</S.ButtonWrapper>
				)}
			</S.CollectionCard>
		);
	} else {
		return <div>Loading</div>;
	}
}
