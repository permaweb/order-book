import { language } from 'helpers/language';

import * as S from './styles';

export default function Footer() {
	return (
		<S.Wrapper>
			<S.Container>
				<S.Content>{`${language.appName} ${new Date().getFullYear()}`}</S.Content>
				<S.SocialContainer>
					{/* {SOCIAL_PATHS.map((path, index) => (
						<a key={index} target={'_blank'} rel={'noreferrer'} href={path.href}>
							{path.name}
						</a>
					))} */}
				</S.SocialContainer>
			</S.Container>
		</S.Wrapper>
	);
}
