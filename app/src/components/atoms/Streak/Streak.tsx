import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { CURRENCY_DICT, ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { AR_PROFILE, ASSETS, CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import { formatAddress, formatCount, getRangeLabel, getStreakIcon } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { RootState } from 'store';
import { CloseHandler } from 'wrappers/CloseHandler';

import { Button } from '../Button';
import { ButtonLink } from '../ButtonLink';

import * as S from './styles';
import { IProps } from './types';

export default function Streak(props: IProps) {
	const ucmReducer = useSelector((state: RootState) => state.ucmReducer);

	const orProvider = useOrderBookProvider();

	const [ownerStreaks, setOwnerStreaks] = React.useState<any>(null);
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
	const [showModal, setShowModal] = React.useState<boolean>(false);

	const [currentBlockHeight, setCurrentBlockHeight] = React.useState<number | null>(0);

	React.useEffect(() => {
		(async function () {
			if (orProvider.orderBook && showDropdown) {
				if (ucmReducer) {
					setOwnerStreaks(await getOwnerStreaks(ucmReducer.streaks, orProvider));
				}

				const info = await orProvider.orderBook.api.arClient.arweavePost.network.getInfo();
				setCurrentBlockHeight(info.height);
			}
		})();
	}, [orProvider.orderBook, showDropdown, ucmReducer]);

	function getStreakHeader(count: number) {
		if (count !== null) {
			let title: string;
			switch (getRangeLabel(count)) {
				case '0-7':
					title = count <= 0 ? language.streakTitle1 : language.streakTitle2;
					break;
				case '8-14':
					title = language.streakTitle3;
					break;
				case '15-29':
					title = language.streakTitle4;
					break;
				case '30+':
					title = language.streakTitle5;
					break;
				default:
					break;
			}
			return (
				<p>{`${title}, ${props.owner.handle ? props.owner.handle : formatAddress(props.owner.address, false)}!`}</p>
			);
		} else return null;
	}

	function getStreakCountdown() {
		if (props.streak && currentBlockHeight) {
			const rewardsInterval = 720;
			const blockTime = 2;

			const lastHeightDiff = currentBlockHeight - props.streak.lastHeight;
			const remainingBlocks = rewardsInterval - lastHeightDiff;

			const remainingBlockMinutes = Math.abs(remainingBlocks) * blockTime;

			const hours = Math.floor(remainingBlockMinutes / 60);
			const minutes = remainingBlockMinutes % 60;

			const remainingTime = `${hours} hours ${minutes} minutes`;

			if (props.streak.days > 0) {
				return (
					<>
						<span>{`${language.approximateStreakTime}:`}</span>
						<p>{remainingTime}</p>
						<span>{`${
							remainingBlocks > 0 ? language.approximateStreakTimeInfo : language.approximateStreakTimeRemaining
						}!`}</span>
					</>
				);
			} else return <span>{`${language.streakStart}!`}</span>;
		} else return null;
	}

	return props.streak ? (
		<>
			<CloseHandler active={showDropdown} disabled={!showDropdown || showModal} callback={() => setShowDropdown(false)}>
				<S.Wrapper>
					<S.SAction
						onClick={() => {
							setShowDropdown(!showDropdown);
							props.handlePress();
						}}
					>
						<S.SWrapper>
							{getStreakIcon(props.streak.days)}
							<p>{props.streak.days}</p>
						</S.SWrapper>
						<S.BWrapper>
							<p>{`${formatCount((props.pixlBalance / 1e6).toFixed(2))}`}</p>
							<ReactSVG src={CURRENCY_ICONS['PIXL']} />
						</S.BWrapper>
					</S.SAction>
					{showDropdown && (
						<S.SDropdown className={'border-wrapper'}>
							<S.SDHeader>{getStreakHeader(props.streak.days)}</S.SDHeader>
							<S.SDStreak>
								{getStreakIcon(props.streak.days)}
								<p>{language.dayStreak(props.streak.days.toString()).toUpperCase()}</p>
							</S.SDStreak>
							<S.SDCountdown>{getStreakCountdown()}</S.SDCountdown>
							<S.SDActions>
								<S.SDActionsFlex>
									<S.SDLink>
										<Link onClick={() => setShowDropdown(false)} to={`${urls.asset}${ORDERBOOK_CONTRACT}`}>
											<ReactSVG src={CURRENCY_ICONS[CURRENCY_DICT.U]} />
											<ReactSVG src={CURRENCY_ICONS['PIXL']} />
											<p>{language.swap}</p>
										</Link>
									</S.SDLink>
									<S.SDLAction>
										<Button
											type={'alt2'}
											label={language.streakLeaderboard}
											handlePress={() => setShowModal(!showModal)}
											height={45}
											icon={ASSETS.leaderboard}
											iconLeftAlign
										/>
									</S.SDLAction>
								</S.SDActionsFlex>
								<ButtonLink
									useCallback={() => setShowDropdown(false)}
									type={'alt1'}
									label={language.streakInfoDetails}
									href={`${urls.account}${props.owner.address}`}
									height={50}
									fullWidth
								/>
							</S.SDActions>
						</S.SDropdown>
					)}
				</S.Wrapper>
			</CloseHandler>
			{showModal && (
				<Modal header={language.streakLeaderboard} handleClose={() => setShowModal(false)}>
					<S.MWrapper>
						<S.M2>
							<S.M2Body>
								{ownerStreaks ? (
									ownerStreaks.map((owner: any, index: number) => {
										return (
											<S.M2BodyFlex key={index}>
												<S.MDetailFlex>
													<S.Rank>{`${index + 1}.`}</S.Rank>
													<OwnerInfo
														owner={owner}
														asset={null}
														isSaleOrder={false}
														handleUpdate={() => {}}
														loading={false}
														hideOrderCancel={false}
														useCallback={() => {
															setShowDropdown(false);
															setShowModal(false);
														}}
													/>
												</S.MDetailFlex>
												<S.MDetailFlexAlt>
													<p>{language.dayCount(owner.streak.days)}</p>
													{getStreakIcon(owner.streak.days)}
												</S.MDetailFlexAlt>
											</S.M2BodyFlex>
										);
									})
								) : (
									<p>{`${language.loading}...`}</p>
								)}
							</S.M2Body>
						</S.M2>
					</S.MWrapper>
				</Modal>
			)}
		</>
	) : null;
}

async function getOwnerStreaks(streaks: any, orProvider: any) {
	let owners: any[] = await Promise.all(
		Object.keys(streaks).map(async (address: string) => {
			const profile = await orProvider.orderBook.api.getProfile({ walletAddress: address });
			let handle = profile ? profile.handle : null;

			let avatar = profile ? profile.avatar : null;
			if (avatar === AR_PROFILE.defaultAvatar) avatar = null;
			if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

			handle = !handle && address === orProvider.orderBook.env.orderBookContract ? language.orderBook : handle;
			return {
				address: address,
				handle: handle,
				avatar: avatar,
				streak: streaks[address] ? streaks[address] : 0,
			};
		})
	);

	return owners
		.sort((a: any, b: any) => {
			if (a.streak.days < b.streak.days) return -1;
			if (a.streak.days > b.streak.days) return 1;
			return 0;
		})
		.reverse();
}
