import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { OrderBook, OrderBookType, ProfileType } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { API_CONFIG, AR_WALLETS, ASSETS, CURRENCIES, WALLET_PERMISSIONS } from 'helpers/config';
import { getArweaveBalanceEndpoint, getCurrencyBalanceEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { WalletEnum } from 'helpers/types';
import { RootState } from 'store';

import * as S from './styles';

interface ArweaveContextState {
	wallets: { type: string; logo: string }[];
	walletAddress: string | null;
	walletType: WalletEnum | null;
	availableBalance: number | null;
	handleConnect: (walletType: WalletEnum.arConnect | WalletEnum.arweaveApp) => Promise<any>;
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
	walletType: null,
	availableBalance: null,
	handleConnect() {
		console.error(language.connectorNotFound);
		return null;
	},
	handleDisconnect() {
		console.error(language.connectorNotFound);
	},
	walletModalVisible: false,
	setWalletModalVisible(_open: boolean) {},
	arProfile: null,
	currencyBalances: null,
	setUpdateBalance(_updateBalance: boolean) {},
};

const ARContext = React.createContext<ArweaveContextState>(DEFAULT_CONTEXT);

export function useArweaveProvider(): ArweaveContextState {
	return React.useContext(ARContext);
}

function WalletList(props: { handleConnect: (walletType: WalletEnum.arConnect | WalletEnum.arweaveApp) => void }) {
	return (
		<S.WalletListContainer>
			{AR_WALLETS.map((wallet, index) => (
				<S.WalletListItem key={index} onClick={() => props.handleConnect(wallet.type)}>
					<img src={`${wallet.logo}`} alt={''} />
					<span>{wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)}</span>
				</S.WalletListItem>
			))}
		</S.WalletListContainer>
	);
}

export function ArweaveProvider(props: ArweaveProviderProps) {
	const wallets = AR_WALLETS;

	const [orderBook, setOrderBook] = React.useState<OrderBookType>();
	const [walletModalVisible, setWalletModalVisible] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
	const [walletType, setWalletType] = React.useState<WalletEnum | null>(null);
	const [availableBalance, setAvailableBalance] = React.useState<number | null>(null);
	const [arProfile, setArProfile] = React.useState<ProfileType | null>(null);
	const [currencyBalances, setCurrencyBalances] = React.useState<CurrencyBalancesType | null>(null);

	const [updateBalance, setUpdateBalance] = React.useState<boolean>(false);

	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	async function handleArConnect() {
		let walletObj: any = null;
		if (!walletAddress) {
			if (window.arweaveWallet) {
				await global.window?.arweaveWallet
					?.connect(WALLET_PERMISSIONS as any)
					.then(() => {
						setWalletModalVisible(false);
					})
					.catch((e: any) => {
						alert(e);
					});
				setWalletType(WalletEnum.arConnect);
			} else {
				alert(language.connectorNotFound);
			}
		}
		walletObj = window.arweaveWallet;
		return walletObj;
	}

	async function handleArweaveApp() {
		let walletObj: any = null;
		const wallet = new ArweaveWebWallet({
			name: language.appName,
			logo: ASSETS.logoAlt,
		});
		wallet.setUrl(WalletEnum.arweaveApp);
		try {
			await wallet.connect();
			setWalletType(WalletEnum.arweaveApp);
			walletObj = wallet;
			return walletObj;
		} catch {}
	}

	async function handleConnect(walletType: WalletEnum.arConnect | WalletEnum.arweaveApp) {
		let walletObj: any = null;
		switch (walletType) {
			case WalletEnum.arConnect:
				walletObj = handleArConnect();
				break;
			case WalletEnum.arweaveApp:
				walletObj = handleArweaveApp();
				break;
			default:
				if (window.arweaveWallet) {
					walletObj = handleArConnect();
					break;
				} else {
					walletObj = handleArweaveApp();
					break;
				}
		}
		setWalletModalVisible(false);
		return walletObj;
	}

	async function handleDisconnect() {
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
		let arweaveGet = Arweave.init({
			host: API_CONFIG.arweaveGet,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		let arweavePost = Arweave.init({
			host: API_CONFIG.arweavePost,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
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
					walletType,
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
