import { ReactSVG } from 'react-svg';

import { ASSETS } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';

// TODO: get stamp count
export default function StampWidget(props: IProps) {
	return (
		<S.Wrapper>
			<p>2</p>
			<div className={'s-divider'} />
			<ReactSVG src={ASSETS.stamps} />
		</S.Wrapper>
	);
}
