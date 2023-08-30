import React from 'react';
import parse from 'html-react-parser';

import { ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { AR_PROFILE, ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

// TODO: get connected wallet balances
// TODO: handle wallet not connected
export default function Streak(props: IProps) {
	const orProvider = useOrderBookProvider();

	const [ownerStreaks, setOwnerStreaks] = React.useState<any>(null);
	const [showModal, setShowModal] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (orProvider.orderBook) {
				const orderBookState = await orProvider.orderBook.api.arClient.read(ORDERBOOK_CONTRACT);
				if (orderBookState) {
					setOwnerStreaks(await getOwnerStreaks(orderBookState.streaks, orProvider));
				}
			}
		})();
	}, [orProvider.orderBook]);

	function getRangeLabel(number: number) {
		if (number >= 1 && number <= 7) return '1-7';
		if (number >= 8 && number <= 14) return '8-14';
		if (number >= 15 && number <= 29) return '15-29';
		if (number >= 30) return '30+';
		return 'out-of-range';
	}

	function getStreakIcon(count: string) {
		if (count) {
			let icon: string;
			switch (getRangeLabel(Number(count))) {
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
		<>
			{showModal && (
				<Modal header={language.streak} handleClose={() => setShowModal(false)} useMax>
					<S.MWrapper>
						<S.M1>
							<S.MHeader className={'border-wrapper-alt'}>
								<p>{parse(language.streakInfo)}</p>
							</S.MHeader>
							<S.M1Body>
								<S.MBodyFlex>
									<span>{`${language.yourStreak}:`}</span>
									<p>1 Day</p>
									{getStreakIcon(props.streak)}
								</S.MBodyFlex>
								<S.MBodyFlex>
									<span>{`${language.yourPixlBalane}:`}</span>
									<p>4567.32</p>
								</S.MBodyFlex>
								<S.MBodyFlex>
									<span>{`${language.yourUCMOwnershipPercentage}:`}</span>
									<p>1.68%</p>
								</S.MBodyFlex>
							</S.M1Body>
						</S.M1>
						<S.M2>
							<S.M2Header>
								<p>{language.streakLeaderboard}</p>
							</S.M2Header>
							<S.M2Body className={'border-wrapper-alt'}>
								{ownerStreaks &&
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
														useCallback={() => setShowModal(false)}
													/>
												</S.MDetailFlex>
												<S.MDetailFlex>
													<p>{language.dayCount(owner.streak.days)}</p>
													{getStreakIcon(owner.streak.days)}
												</S.MDetailFlex>
											</S.M2BodyFlex>
										);
									})}
							</S.M2Body>
						</S.M2>
					</S.MWrapper>
				</Modal>
			)}
			{/* <S.Wrapper onClick={() => setShowModal(!showModal)} title={language.dayStreak(props.streak).toUpperCase()}>
				{getStreakIcon(props.streak)}
				<p>{props.streak}</p>
			</S.Wrapper> */}
			<S.WrapperTemp>
				{getStreakIcon(props.streak)}
				<p>{language.dayStreak(props.streak).toUpperCase()}</p>
			</S.WrapperTemp>
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
