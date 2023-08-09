import { Link } from 'react-router-dom';

import { SOCIAL_PATHS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';

export default function Footer() {
	return (
		<S.Wrapper>
			<S.Container>
				<S.Content>{`${language.appName} ${new Date().getFullYear()}`}</S.Content>
				<S.EWrapper>
					<Link to={urls.docs}>{language.learn}</Link>
					{SOCIAL_PATHS.map((path, index) => (
						<a key={index} target={'_blank'} rel={'noreferrer'} href={path.href}>
							{path.name}
						</a>
					))}
				</S.EWrapper>
			</S.Container>
		</S.Wrapper>
	);
}
