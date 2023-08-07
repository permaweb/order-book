import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { CURRENCY_DICT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { ASSETS, CURRENCY_ICONS } from 'helpers/config';
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
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
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
			setShowDropdown(true);
		} else {
			arProvider.setWalletModalVisible(true);
		}
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
		setShowDropdown(false);
		if (props.callback) {
			props.callback();
		}
	}

	function handleDisconnect() {
		arProvider.handleDisconnect();
		setShowDropdown(false);
	}

	return (
		<CloseHandler callback={() => setShowDropdown(!showDropdown)} active={showDropdown} disabled={false}>
			<S.Wrapper>
				<S.FlexAction>
					{arProvider.walletAddress && (
						<S.BalancesWrapper>
							{arProvider.currencyBalances && (
								<S.Balance>
									<p>{`${(arProvider.currencyBalances['U'] / 1e6).toFixed(2)}`}</p>
									<ReactSVG src={CURRENCY_ICONS[CURRENCY_DICT.U]} />
								</S.Balance>
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
				{showDropdown && (
					<S.WalletDropdown>
						<li onClick={handleViewAccount}>{language.account}</li>
						<li onClick={copyAddress}>{copied ? `${language.copied}!` : language.copyAddress}</li>
						<li onClick={handleDisconnect}>{language.disconnect}</li>
					</S.WalletDropdown>
				)}
			</S.Wrapper>
		</CloseHandler>
	);
}
