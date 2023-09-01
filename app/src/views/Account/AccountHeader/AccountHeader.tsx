import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { ReactSVG } from 'react-svg';

import { CursorEnum, ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { AR_PROFILE, ASSETS, REDIRECTS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { REDUX_TABLES } from 'helpers/redux';
import { formatAddress, getStreakIcon } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';
import { IProps } from './types';

export default function AccountHeader(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

	const [addressCopied, setAddressCopied] = React.useState<boolean>(false);
	const [urlCopied, setUrlCopied] = React.useState<boolean>(false);

	const [count, setCount] = React.useState<number | null>(null);
	const [streak, setStreak] = React.useState<{ days: string; lastHeight: number } | null>(null);
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (
			cursorsReducer[CursorEnum.idGQL][REDUX_TABLES.userAssets] &&
			cursorsReducer[CursorEnum.idGQL][REDUX_TABLES.userAssets].count !== null
		) {
			setCount(cursorsReducer[CursorEnum.idGQL][REDUX_TABLES.userAssets].count);
		}
	}, [cursorsReducer[CursorEnum.idGQL]]);

	React.useEffect(() => {
		(async function () {
			if (props.profile && orProvider.orderBook) {
				const orderBookState = await orProvider.orderBook.api.arClient.read(ORDERBOOK_CONTRACT);
				const streak = orderBookState.streaks[props.profile.walletAddress];
				if (streak) setStreak(streak);
				else setStreak(null);
			}
		})();
	}, [props.profile, orProvider.orderBook]);

	const copyText = React.useCallback(async (text: string, type: 'address' | 'url') => {
		if (text) {
			if (text.length > 0) {
				await navigator.clipboard.writeText(text);
				if (type === 'address') setAddressCopied(true);
				else setUrlCopied(true);
				setTimeout(() => (type === 'address' ? setAddressCopied(false) : setUrlCopied(false)), 2000);
			}
		}
	}, []);

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
		if (props.profile) {
			if (props.profile.handle) return props.profile.handle;
			else if (props.profile.walletAddress) return formatAddress(props.profile.walletAddress, false);
			else return null;
		} else return null;
	}

	const subheader = () => {
		if (props.profile) {
			return (
				<S.SubHeader>
					<p>{formatAddress(props.profile.walletAddress, false)}</p>
					<IconButton
						type={'primary'}
						src={addressCopied ? ASSETS.checkmark : ASSETS.copy}
						handlePress={() => copyText(props.profile.walletAddress, 'address')}
						sm
					/>
					{getAction()}
				</S.SubHeader>
			);
		} else {
			return null;
		}
	};

	function getAction() {
		if (!props.profile) return null;
		if (!arProvider.walletAddress || !props.profile.walletAddress) return null;
		else {
			if (arProvider.walletAddress === props.profile.walletAddress && !props.profile.handle) {
				return (
					<S.Action>
						<Link to={REDIRECTS.arProfile} target={'_blank'}>
							{language.createProfile}
						</Link>
					</S.Action>
				);
			} else return null;
		}
	}

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper className={'border-wrapper-alt'}>
					<S.C1>
						<S.HeaderWrapper>
							<S.AvatarWrapper>{getProfileImage()}</S.AvatarWrapper>
							<S.HeaderContainer>
								<S.Header>
									<h2>{getHeader()}</h2>
								</S.Header>
								{subheader()}
							</S.HeaderContainer>
							{streak && (
								<S.SWrapper>
									<p>{language.dayStreak(streak.days).toUpperCase()}</p>
									{getStreakIcon(Number(streak.days))}
								</S.SWrapper>
							)}
						</S.HeaderWrapper>
						<S.ShareWrapper>
							<CloseHandler callback={() => setShowDropdown(!showDropdown)} active={showDropdown} disabled={false}>
								<Button
									type={'primary'}
									label={language.shareProfile}
									handlePress={() => setShowDropdown(!showDropdown)}
									icon={ASSETS.share}
									iconLeftAlign
									noMinWidth
								/>
								{showDropdown && (
									<S.ShareDropdown>
										<li onClick={() => copyText(window.location.href, 'url')}>
											{urlCopied ? `${language.copied}!` : language.copyURL}
										</li>
										<S.Share>
											<TwitterShareButton title={''} url={window.location.href}>
												{language.shareOn}
												<ReactSVG src={ASSETS.x} />
											</TwitterShareButton>
										</S.Share>
									</S.ShareDropdown>
								)}
							</CloseHandler>
						</S.ShareWrapper>
					</S.C1>
					<S.InfoWrapper>
						{count !== null && (
							<S.Info>
								<span>{`${language.assets}:`}</span>
								<p>{count}</p>
							</S.Info>
						)}
					</S.InfoWrapper>
				</S.Wrapper>
			</div>
		</div>
	);
}
