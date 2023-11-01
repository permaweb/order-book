import { Button } from 'components/atoms/Button';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function CollectionsSort(props: IProps) {
	return (
		<S.Wrapper>
			<S.Action>
				<Button
					type={'primary'}
					label={language.new}
					handlePress={() => props.setCurrentSort('new')}
					active={props.currentSort === 'new'}
					icon={props.currentSort === 'new' ? ASSETS.checkmark : null}
					noMinWidth
				/>
			</S.Action>
			<S.Action>
				<Button
					type={'primary'}
					label={language.byStamps}
					handlePress={() => props.setCurrentSort('stamps')}
					active={props.currentSort === 'stamps'}
					icon={props.currentSort === 'stamps' ? ASSETS.checkmark : null}
					disabled={props.stampDisabled}
					noMinWidth
				/>
			</S.Action>
		</S.Wrapper>
	);
}
