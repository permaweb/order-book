import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { CURRENCY_DICT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Streak } from 'components/atoms/Streak';
import { Modal } from 'components/molecules/Modal';
import { ASSETS, CURRENCY_ICONS, REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';
import { formatAddress, formatCount } from 'helpers/utils';
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
	const [showUTooltip, setShowUTooltip] = React.useState<boolean>(false);

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

	return (
		<>
			{showUTooltip && (
				<Modal header={language.getU} handleClose={() => setShowUTooltip(false)}>
					<S.Tooltip>
						<p>{language.uDescription}</p>
					</S.Tooltip>
				</Modal>
			)}
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
						{arProvider.walletAddress && arProvider.currencyBalances && (
							<S.BalancesWrapper>
								{arProvider.streak && (
									<S.StreakWrapper>
										<Streak
											streak={arProvider.streak}
											pixlBalance={arProvider.currencyBalances['PIXL']}
											owner={{
												address: arProvider.walletAddress,
												handle: arProvider.arProfile ? arProvider.arProfile.handle : null,
											}}
										/>
									</S.StreakWrapper>
								)}
								{arProvider.currencyBalances && (
									<CloseHandler
										active={showGetBalanceDropdown}
										disabled={!showGetBalanceDropdown}
										callback={() => setShowGetBalanceDropdown(false)}
									>
										<S.BDWrapper>
											<S.BalanceAction
												onClick={() => {
													setShowGetBalanceDropdown(!showGetBalanceDropdown);
													setShowWalletDropdown(false);
												}}
											>
												<p>{`${formatCount((arProvider.currencyBalances['U'] / 1e6).toFixed(2))}`}</p>
												<ReactSVG src={CURRENCY_ICONS[CURRENCY_DICT.U]} />
											</S.BalanceAction>
											{showGetBalanceDropdown && (
												<S.BalanceDropdown>
													<S.BDHeader>
														<p>{language.getU}</p>
														<IconButton
															type={'primary'}
															src={ASSETS.info}
															handlePress={() => setShowUTooltip(!showUTooltip)}
															sm
														/>
													</S.BDHeader>
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
															window.open(REDIRECTS.everpay, '_blank');
															setShowGetBalanceDropdown(false);
														}}
													>
														{language.buyOnEverPay}
													</li>
												</S.BalanceDropdown>
											)}
										</S.BDWrapper>
									</CloseHandler>
								)}
								{arProvider.availableBalance !== null && (
									<S.Balance>
										<p>{`${formatCount(arProvider.availableBalance.toFixed(2))}`}</p>
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
		</>
	);
}
