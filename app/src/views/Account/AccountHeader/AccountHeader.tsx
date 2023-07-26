import { ReactSVG } from 'react-svg';

import { ButtonLink } from 'components/atoms/ButtonLink';
import { AR_PROFILE, ASSETS, REDIRECTS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { formatAddress } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

export default function AccountHeader(props: IProps) {
	function getProfileImage() {
		if (props.profile) {
			let avatar = props.profile.avatar ? props.profile.avatar : null;
			if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
			if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);
			if (avatar) {
				return <S.Avatar src={getTxEndpoint(avatar)} />;
			} else {
				return <ReactSVG src={ASSETS.user} />;
			}
		} else {
			return null;
		}
	}

	function getHeader() {
		if (props.profile) return props.profile.handle;
	}

	function getSubHeader() {
		if (props.profile) return formatAddress(props.profile.walletAddress, true);
		else return language.arProfileCreate;
	}

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper>
					<S.AvatarWrapper>{getProfileImage()}</S.AvatarWrapper>
					<S.ArLogo>
						<ReactSVG src={ASSETS.arLogo} />
					</S.ArLogo>
					<S.Header>
						<p>{getHeader()}</p>
					</S.Header>
					<S.SubHeader>
						<p>{getSubHeader()}</p>
					</S.SubHeader>
					{!props.profile && (
						<S.Action>
							<ButtonLink type={'primary'} href={REDIRECTS.arProfile} label={language.createProfile} targetBlank />
						</S.Action>
					)}
				</S.Wrapper>
			</div>
		</div>
	);
}
