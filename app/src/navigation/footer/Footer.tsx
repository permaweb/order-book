import { Settings } from 'components/organisms/Settings';
import { language } from 'helpers/language';

import * as S from './styles';

export default function Footer() {
	return (
		<S.Wrapper>
			<S.Container>
				<S.Content>{`${language.appName} ${new Date().getFullYear()}`}</S.Content>
				<S.SettingsWrapper>
					<Settings />
				</S.SettingsWrapper>
			</S.Container>
		</S.Wrapper>
	);
}
