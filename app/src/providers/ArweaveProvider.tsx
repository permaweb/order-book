import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { CURRENCY_DICT, OrderBook, ORDERBOOK_CONTRACT, OrderBookType, ProfileType } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { API_CONFIG, APP, AR_WALLETS, ASSETS, CURRENCIES, WALLET_PERMISSIONS } from 'helpers/config';
import { getArweaveBalanceEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { WalletEnum } from 'helpers/types';
import { RootState } from 'store';

import * as S from './styles';

interface ArweaveContextState {
	wallets: { type: string; logo: string }[];
	wallet: any;
	walletAddress: string | null;
	walletType: WalletEnum | null;
	availableBalance: number | null;
	handleConnect: (walletType: WalletEnum.arConnect | WalletEnum.arweaveApp) => Promise<any>;
	handleDisconnect: () => void;
	walletModalVisible: boolean;
	setWalletModalVisible: (open: boolean) => void;
	arProfile: any;
	streak: { days: string; lastHeight: number } | null;
	currencyBalances: CurrencyBalancesType | null;
	setUpdateBalance: (updateBalance: boolean) => void;
}

interface ArweaveProviderProps {
	children: React.ReactNode;
}

interface CurrencyBalancesType {
	U: number;
	PIXL: number;
}

const DEFAULT_CONTEXT = {
	wallets: [],
	wallet: null,
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
	streak: null,
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

	const [wallet, setWallet] = React.useState<any>(null);
	const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
	const [walletType, setWalletType] = React.useState<WalletEnum | null>(null);

	const [availableBalance, setAvailableBalance] = React.useState<number | null>(null);
	const [arProfile, setArProfile] = React.useState<ProfileType | null>(null);
	const [streak, setStreak] = React.useState<{ days: string; lastHeight: number } | null>(null);
	const [currencyBalances, setCurrencyBalances] = React.useState<CurrencyBalancesType | null>(null);

	const [updateBalance, setUpdateBalance] = React.useState<boolean>(false);
	const [newVersion, setNewVersion] = React.useState<boolean>(
		!localStorage.getItem(APP.providerKey) || localStorage.getItem(APP.providerKey) !== APP.providerVersion
	);

	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	async function handleArConnect() {
		if (!walletAddress) {
			if (window.arweaveWallet) {
				try {
					await global.window?.arweaveWallet?.connect(WALLET_PERMISSIONS as any);
					setWalletAddress(await global.window.arweaveWallet.getActiveAddress());
					setWallet(window.arweaveWallet);
					setWalletType(WalletEnum.arConnect);
					setWalletModalVisible(false);
				} catch (e: any) {
					alert(e);
				}
			} else {
				alert(language.connectorNotFound);
			}
		}
	}

	async function handleArweaveApp() {
		const wallet = new ArweaveWebWallet({
			name: language.appName,
			logo: ASSETS.logoAlt,
		});
		wallet.setUrl(WalletEnum.arweaveApp);
		await wallet.connect();
		wallet.on('disconnect', () => {
			handleDisconnect();
		});
		setWallet(wallet);
		setWalletType(WalletEnum.arweaveApp);
	}

	async function handleConnect(walletType: WalletEnum.arConnect | WalletEnum.arweaveApp) {
		let walletObj: any = null;
		switch (walletType) {
			case WalletEnum.arConnect:
				handleArConnect();
				break;
			case WalletEnum.arweaveApp:
				handleArweaveApp();
				break;
			default:
				if (window.arweaveWallet || walletType === WalletEnum.arConnect) {
					handleArConnect();
					break;
				} else {
					handleArweaveApp();
					break;
				}
		}
		setWalletModalVisible(false);
		return walletObj;
	}

	async function handleDisconnect() {
		await global.window?.arweaveWallet?.disconnect();
		setWallet(null);
		setWalletType(null);
		setWalletAddress(null);
	}

	const getUserBalance = async (wallet: string) => {
		try {
			const rawBalance = await fetch(getArweaveBalanceEndpoint(wallet));
			const jsonBalance = await rawBalance.json();
			return jsonBalance / 1e12;
		} catch (error: any) {
			console.error(error);
			return 0;
		}
	};

	React.useEffect(() => {
		async function handleWallet() {
			if (!newVersion) {
				let walletAddress: string | null = null;
				try {
					walletAddress = await global.window.arweaveWallet.getActiveAddress();

					if (walletType !== WalletEnum.arweaveApp) {
						setWalletType(WalletEnum.arConnect);
						setWallet(window.arweaveWallet);
					}
				} catch {}
				if (walletAddress) {
					setWalletAddress(walletAddress as any);
					setAvailableBalance(await getUserBalance(walletAddress));
				}
			} else {
				setNewVersion(false);
				localStorage.setItem(APP.providerKey, APP.providerVersion);
				await handleDisconnect();
			}
		}

		handleWallet();

		window.addEventListener('arweaveWalletLoaded', handleWallet);

		return () => {
			window.removeEventListener('arweaveWalletLoaded', handleWallet);
		};
	}, [walletType]);

	React.useEffect(() => {
		const arweaveGet = Arweave.init({
			host: API_CONFIG.arweaveGet,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		const arweavePost = Arweave.init({
			host: API_CONFIG.arweavePost,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		const warp = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		}).use(new DeployPlugin());

		setOrderBook(
			OrderBook.init({
				currency: CURRENCIES.default,
				arweaveGet: arweaveGet,
				arweavePost: arweavePost,
				bundlrKey: null,
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
			}
		})();
	}, [walletAddress, orderBook]);

	React.useEffect(() => {
		(async function () {
			if (walletAddress && orderBook) {
				const uCurrencyState = await orderBook.api.arClient.read(CURRENCY_DICT['U']);
				const uBalance = uCurrencyState.balances[walletAddress];

				const orderBookState = await orderBook.api.arClient.read(ORDERBOOK_CONTRACT);
				const pixlBalance = orderBookState.balances[walletAddress];

				setCurrencyBalances({
					U: uBalance ? uBalance : 0,
					PIXL: pixlBalance ? pixlBalance : 0,
				});
			}
		})();
	}, [walletAddress, orderBook, updateBalance]);

	React.useEffect(() => {
		(async function () {
			if (walletAddress && orderBook) {
				const orderBookState = await orderBook.api.arClient.read(ORDERBOOK_CONTRACT);
				const streak = orderBookState.streaks[walletAddress];
				if (streak) {
					setStreak(streak);
				}
			}
		})();
	}, [walletAddress, orderBook]);

	return (
		<>
			{walletModalVisible && (
				<Modal header={language.connect} handleClose={() => setWalletModalVisible(false)}>
					<WalletList handleConnect={handleConnect} />
				</Modal>
			)}
			<ARContext.Provider
				value={{
					wallet,
					walletAddress,
					walletType,
					availableBalance,
					handleConnect,
					handleDisconnect,
					wallets,
					walletModalVisible,
					setWalletModalVisible,
					arProfile,
					streak,
					currencyBalances,
					setUpdateBalance: setUpdateBalance,
				}}
			>
				{props.children}
			</ARContext.Provider>
		</>
	);
}
