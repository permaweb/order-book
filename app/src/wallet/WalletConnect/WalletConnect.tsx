import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { CURRENCY_DICT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { ASSETS, CURRENCY_ICONS, REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

export default function WalletConnect(props: { callback?: () => void }) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const [showWallet, setShowWallet] = React.useState<boolean>(false);
	const [showWalletDropdown, setShowWalletDropdown] = React.useState<boolean>(false);
	const [showGetBalanceDropdown, setShowGetBalanceDropdown] = React.useState<boolean>(false);
	const [copied, setCopied] = React.useState<boolean>(false);
	const [label, setLabel] = React.useState<string | null>(null);

	React.useEffect(() => {
		setTimeout(() => {
			setShowWallet(true);
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (!showWallet) {
			setLabel(`${language.fetching}...`);
		} else {
			if (arProvider.walletAddress) {
				if (arProvider.arProfile && arProvider.arProfile.handle) {
					setLabel(arProvider.arProfile.handle);
				} else {
					setLabel(formatAddress(arProvider.walletAddress, false));
				}
			} else {
				setLabel(language.connect);
			}
		}
	}, [showWallet, arProvider.walletAddress, arProvider.arProfile]);

	function handlePress() {
		if (arProvider.walletAddress) {
			setShowWalletDropdown(true);
		} else {
			arProvider.setWalletModalVisible(true);
		}
		setShowGetBalanceDropdown(false);
	}

	const copyAddress = React.useCallback(async () => {
		if (arProvider.walletAddress) {
			if (arProvider.walletAddress.length > 0) {
				await navigator.clipboard.writeText(arProvider.walletAddress);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, [arProvider.walletAddress]);

	function handleViewAccount() {
		navigate(`${urls.account}${arProvider.walletAddress}`);
		setShowWalletDropdown(false);
		if (props.callback) {
			props.callback();
		}
	}

	function handleDisconnect() {
		arProvider.handleDisconnect();
		setShowWalletDropdown(false);
	}

	function getRangeLabel(number: number) {
		if (number >= 1 && number <= 7) return '1-7';
		if (number >= 8 && number <= 14) return '8-14';
		if (number >= 15 && number <= 29) return '15-29';
		if (number >= 30) return '30+';
		return 'out-of-range';
	}

	function getStreakIcon() {
		if (arProvider.streak) {
			const num = Number(arProvider.streak.days);
			let icon: string;
			switch (getRangeLabel(num)) {
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

	return (
		<CloseHandler
			callback={() => {
				setShowWalletDropdown(false);
				setShowGetBalanceDropdown(false);
			}}
			active={showWalletDropdown || showGetBalanceDropdown}
			disabled={false}
		>
			<S.Wrapper>
				<S.FlexAction>
					{arProvider.walletAddress && (
						<S.BalancesWrapper>
							{arProvider.streak && (
								<S.Streak>
									{getStreakIcon()}
									<p>{language.dayStreak(arProvider.streak.days).toUpperCase()}</p>
								</S.Streak>
							)}
							{arProvider.currencyBalances && (
								<S.BDWrapper>
									<S.BalanceAction
										onClick={() => {
											setShowGetBalanceDropdown(!showGetBalanceDropdown);
											setShowWalletDropdown(false);
										}}
									>
										<p>{`${(arProvider.currencyBalances['U'] / 1e6).toFixed(2)}`}</p>
										<ReactSVG src={CURRENCY_ICONS[CURRENCY_DICT.U]} />
									</S.BalanceAction>
									{showGetBalanceDropdown && (
										<S.BalanceDropdown>
											<p>{language.getU}</p>
											<li
												onClick={() => {
													window.open(REDIRECTS.u, '_blank');
													setShowGetBalanceDropdown(false);
												}}
											>
												{language.burnYourOwn}
											</li>
											<li
												onClick={() => {
													window.open(REDIRECTS.permaswap, '_blank');
													setShowGetBalanceDropdown(false);
												}}
											>
												{language.buyOnPermaswap}
											</li>
										</S.BalanceDropdown>
									)}
								</S.BDWrapper>
							)}
							{arProvider.availableBalance !== null && (
								<S.Balance>
									<p>{`${arProvider.availableBalance.toFixed(2)}`}</p>
									<ReactSVG src={ASSETS.arLogo} />
								</S.Balance>
							)}
						</S.BalancesWrapper>
					)}
					<Button
						type={'primary'}
						label={label ? label : ''}
						handlePress={handlePress}
						height={45}
						noMinWidth
						icon={ASSETS.wallet}
					/>
				</S.FlexAction>
				{showWalletDropdown && (
					<S.Dropdown>
						<li onClick={handleViewAccount}>{language.account}</li>
						<li onClick={copyAddress}>{copied ? `${language.copied}!` : language.copyAddress}</li>
						<li onClick={handleDisconnect}>{language.disconnect}</li>
					</S.Dropdown>
				)}
			</S.Wrapper>
		</CloseHandler>
	);
}
