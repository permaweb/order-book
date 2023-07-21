import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import styled from 'styled-components';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { OrderBook, OrderBookType, ProfileType } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { AR_WALLETS, CURRENCIES, WALLET_PERMISSIONS } from 'helpers/config';
import { getArweaveBalanceEndpoint, getCurrencyBalanceEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { STYLING } from 'helpers/styling';
import { RootState } from 'store';

export const WalletListContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

export const WalletListItem = styled.button`
	height: 55px;
	width: 100%;
	text-align: left;
	padding: 0 20px;
	display: flex;
	align-items: center;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
	img {
		width: 30px;
		margin: 0 15px 0 0;
	}
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		margin-top: 2.5px;
	}
`;

interface ArweaveContextState {
	wallets: { name: string; logo: string }[];
	walletAddress: string | null;
	availableBalance: number | null;
	handleConnect: () => void;
	handleDisconnect: () => void;
	walletModalVisible: boolean;
	setWalletModalVisible: (open: boolean) => void;
	arProfile: any;
	currencyBalances: CurrencyBalancesType | null;
	setUpdateBalance: (updateBalance: boolean) => void;
}

interface ArweaveProviderProps {
	children: React.ReactNode;
}

interface CurrencyBalancesType {
	U: number;
}

const DEFAULT_CONTEXT = {
	wallets: [],
	walletAddress: null,
	availableBalance: null,
	handleConnect() {
		console.error(`No Connector Found`);
	},
	handleDisconnect() {
		console.error(`No Connection Found`);
	},
	walletModalVisible: false,
	setWalletModalVisible(_open: boolean) {
		console.error(`Make sure to render ArweaveProvider as an ancestor of the component that uses ARContext.Provider`);
	},
	arProfile: null,
	currencyBalances: null,
	setUpdateBalance(_updateBalance: boolean) {},
};

const ARContext = React.createContext<ArweaveContextState>(DEFAULT_CONTEXT);

export function useArweaveProvider(): ArweaveContextState {
	return React.useContext(ARContext);
}

function WalletList(props: { handleConnect: () => void }) {
	return (
		<WalletListContainer>
			{AR_WALLETS.map((wallet, index) => (
				<WalletListItem key={index} onClick={() => props.handleConnect()}>
					<img src={`${wallet.logo}`} alt={''} />
					<span>{wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)}</span>
				</WalletListItem>
			))}
		</WalletListContainer>
	);
}

export function ArweaveProvider(props: ArweaveProviderProps) {
	const wallets = AR_WALLETS;

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();
	const [walletModalVisible, setWalletModalVisible] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
	const [availableBalance, setAvailableBalance] = React.useState<number | null>(null);
	const [arProfile, setArProfile] = React.useState<ProfileType | null>(null);
	const [currencyBalances, setCurrencyBalances] = React.useState<CurrencyBalancesType | null>(null);

	const [updateBalance, setUpdateBalance] = React.useState<boolean>(false);

	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	async function handleConnect() {
		// @ts-ignore
		await global.window?.arweaveWallet
			?.connect(WALLET_PERMISSIONS as any)
			.then(() => {
				setWalletModalVisible(false);
			})
			.catch((e: any) => {
				alert(e);
			});
	}

	async function handleDisconnect() {
		// @ts-ignore
		await global.window?.arweaveWallet?.disconnect();
		setWalletAddress(null);
	}

	const getUserBalance = async (wallet: string) => {
		const rawBalance = await fetch(getArweaveBalanceEndpoint(wallet));
		const jsonBalance = await rawBalance.json();
		return jsonBalance / 1e12;
	};

	React.useEffect(() => {
		async function handleWallet() {
			let walletAddress: string | null = null;
			try {
				// @ts-ignore
				walletAddress = await global.window.arweaveWallet.getActiveAddress();
			} catch {}
			if (walletAddress) {
				setWalletAddress(walletAddress as any);
				setAvailableBalance(await getUserBalance(walletAddress));
			}
		}

		handleWallet();

		window.addEventListener('arweaveWalletLoaded', handleWallet);

		return () => {
			window.removeEventListener('arweaveWalletLoaded', handleWallet);
		};
	});

	React.useEffect(() => {
		const GET_ENDPOINT = 'arweave-search.goldsky.com';
		const POST_ENDPOINT = 'arweave.net';

		const PORT = 443;
		const PROTOCOL = 'https';
		const TIMEOUT = 40000;
		const LOGGING = false;

		let arweaveGet = Arweave.init({
			host: GET_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		let arweavePost = Arweave.init({
			host: POST_ENDPOINT,
			port: PORT,
			protocol: PROTOCOL,
			timeout: TIMEOUT,
			logging: LOGGING,
		});

		let warp = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		});

		setOrderBook(
			OrderBook.init({
				currency: CURRENCIES.default,
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				warp: warp,
				warpDreNode: dreReducer.source,
			})
		);
	}, [dreReducer.source]);

	React.useEffect(() => {
		(async function () {
			if (walletAddress && orderBook) {
				const profile = await orderBook.api.getProfile({ walletAddress: walletAddress });
				if (profile) {
					setArProfile(profile);
				} else {
					setArProfile(null);
				}

				try {
					let dreNode = dreReducer.source.substring(0, dreReducer.source.lastIndexOf('/'));
					const rawBalance = await fetch(
						getCurrencyBalanceEndpoint(walletAddress, orderBook.env.currencyContract, dreNode)
					);
					const jsonBalance = await rawBalance.json();
					const numBalance = jsonBalance.result && jsonBalance.result[0] ? jsonBalance.result[0] : 0;
					setCurrencyBalances({
						U: numBalance,
					});
				} catch (e: any) {
					setCurrencyBalances({
						U: 0,
					});
				}
			}
		})();
	}, [walletAddress, orderBook, updateBalance]);

	return (
		<>
			{walletModalVisible && (
				<Modal header={language.connect} handleClose={() => setWalletModalVisible(false)}>
					<WalletList handleConnect={handleConnect} />
				</Modal>
			)}
			<ARContext.Provider
				value={{
					walletAddress,
					availableBalance,
					handleConnect,
					handleDisconnect,
					wallets,
					walletModalVisible,
					setWalletModalVisible,
					arProfile,
					currencyBalances,
					setUpdateBalance: setUpdateBalance,
				}}
			>
				{props.children}
			</ARContext.Provider>
		</>
	);
}
