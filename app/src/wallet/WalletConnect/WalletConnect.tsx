import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'components/atoms/Button';
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

	React.useEffect(() => {
		setTimeout(() => {
			setShowWallet(true);
		}, 200);
	}, [arProvider.walletAddress]);

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
		navigate(urls.account);
		setShowDropdown(false);
		if (props.callback) {
			props.callback();
		}
	}

	function handleDisconnect() {
		arProvider.handleDisconnect();
		setShowDropdown(false);
	}

	function getWalletLabel() {
		if (!showWallet) {
			return `${language.fetching} ...`;
		} else {
			if (arProvider.walletAddress) {
				if (arProvider.arProfile) {
					return arProvider.arProfile.handle;
				} else {
					return formatAddress(arProvider.walletAddress, false);
				}
			} else {
				return language.connect;
			}
		}
	}

	return (
		<CloseHandler callback={() => setShowDropdown(!showDropdown)} active={showDropdown} disabled={false}>
			<S.Wrapper>
				<Button type={'alt2'} label={getWalletLabel()} handlePress={handlePress} width={160} useMaxWidth />
				{showDropdown && (
					<S.WalletDropdown>
						<li onClick={handleViewAccount}>{language.account}</li>
						<li onClick={copyAddress}>{copied ? language.copied : language.copyAddress}</li>
						<li onClick={handleDisconnect}>{language.disconnect}</li>
					</S.WalletDropdown>
				)}
			</S.Wrapper>
		</CloseHandler>
	);
}
