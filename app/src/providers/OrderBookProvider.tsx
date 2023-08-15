import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { OrderBook, OrderBookType } from 'permaweb-orderbook';

import { API_CONFIG, CURRENCIES } from 'helpers/config';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';

LoggerFactory.INST.logLevel('fatal');

interface OrderBookContextState {
	orderBook: OrderBookType | null;
	setUpdate: (update: boolean) => void;
}

interface OrderBookProviderProps {
	children: React.ReactNode;
}

const DEFAULT_CONTEXT = {
	orderBook: null,
	setUpdate(_update: boolean) {},
};

const OrderBookContext = React.createContext<OrderBookContextState>(DEFAULT_CONTEXT);

export function useOrderBookProvider(): OrderBookContextState {
	return React.useContext(OrderBookContext);
}

export function OrderBookProvider(props: OrderBookProviderProps) {
	const arProvider = useArweaveProvider();
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const [orderBook, setOrderBook] = React.useState<OrderBookType | null>(null);
	const [update, setUpdate] = React.useState<boolean>(false);

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
				bundlrKey: window.arweaveWallet ? window.arweaveWallet : null,
				warp: warp,
				warpDreNode: dreReducer.source,
			})
		);
	}, [arProvider.wallet, arProvider.walletAddress, dreReducer.source, update]);

	return (
		<OrderBookContext.Provider
			value={{
				orderBook,
				setUpdate: setUpdate,
			}}
		>
			{props.children}
		</OrderBookContext.Provider>
	);
}
