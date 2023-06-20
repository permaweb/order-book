import React from 'react';
import { ReactSVG } from 'react-svg';

import { ProfileType } from 'permaweb-orderbook';

import { ButtonLink } from 'components/atoms/ButtonLink';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';

export default function AccountHeader() {
	const arProvider = useArweaveProvider();

    const [arProfile, setArProfile] = React.useState<ProfileType | null>(null);

    React.useEffect(() => {
        if (arProvider && arProvider.arProfile) {
            setArProfile(arProvider.arProfile);
        }
    }, [arProvider])
	
    function getProfileImage() {
        if (arProfile && arProfile.avatar !== 'ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA') {
            return (
                <S.Avatar src={getTxEndpoint(arProfile.avatar!.substring(5))} />
            )
        }
        else {
            return (
                <ReactSVG src={ASSETS.user} />
            )
        }
    }

    function getHeader() {
        if (arProfile) return arProfile.handle;
        else return formatAddress(arProvider.walletAddress, false);
    }

    function getSubHeader() {
        if (arProfile) return formatAddress(arProvider.walletAddress, true);
        else return language.arProfileCreate;
    }

	return arProvider ? (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper>
					<S.AvatarWrapper>
						{getProfileImage()}
					</S.AvatarWrapper>
                    <S.ArLogo>
                        <ReactSVG src={ASSETS.arLogo} />
                    </S.ArLogo>
                    <S.Header>
                        <p>{getHeader()}</p>
                    </S.Header>
                    <S.SubHeader>
                        <p>{getSubHeader()}</p>
                    </S.SubHeader>
                    {!arProfile && 
                        <S.Action>
                            <ButtonLink 
                                type={'primary'}
                                href={REDIRECTS.arProfile}
                                label={language.createProfile}
                                targetBlank
                            />
                        </S.Action>
                    }
				</S.Wrapper>
			</div>
		</div>
	) : null;
}
