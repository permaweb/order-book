import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function Streak(props: IProps) {
	function getRangeLabel(number: number) {
		if (number >= 1 && number <= 7) return '1-7';
		if (number >= 8 && number <= 14) return '8-14';
		if (number >= 15 && number <= 29) return '15-29';
		if (number >= 30) return '30+';
		return 'out-of-range';
	}

	function getStreakIcon() {
		if (props.streak) {
			let icon: string;
			switch (getRangeLabel(Number(props.streak))) {
				case '1-7':
					icon = ASSETS.streak['1'];
					break;
				case '8-14':
					icon = ASSETS.streak['2'];
					break;
				case '15-29':
					icon = ASSETS.streak['3'];
					break;
				case '30+':
					icon = ASSETS.streak['4'];
					break;
				default:
					break;
			}
			return <img src={icon} />;
		} else return null;
	}

	return props.streak ? (
		<S.Wrapper>
			{getStreakIcon()}
			<p>{language.dayStreak(props.streak).toUpperCase()}</p>
		</S.Wrapper>
	) : null;
}
