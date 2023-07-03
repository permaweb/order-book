import React from 'react';
import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';

import { RootState } from 'store';
import { OrderBook, OrderBookType } from 'permaweb-orderbook';

import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useSelector } from 'react-redux';

LoggerFactory.INST.logLevel('fatal');

interface OrderBookContextState {
	orderBook: OrderBookType | null;
}

interface OrderBookProviderProps {
	children: React.ReactNode;
}

const DEFAULT_CONTEXT = {
	orderBook: null,
};

const OrderBookContext = React.createContext<OrderBookContextState>(DEFAULT_CONTEXT);

export function useOrderBookProvider(): OrderBookContextState {
	return React.useContext(OrderBookContext);
}

export function OrderBookProvider(props: OrderBookProviderProps) {
	const arProvider = useArweaveProvider();

	const [orderBook, setOrderBook] = React.useState<OrderBookType | null>(null);

	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	React.useEffect(() => {
		if(arProvider.walletAddress) {
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
					currency: 'U',
					arweaveGet: arweaveGet,
					arweavePost: arweavePost,
					warp: warp,
					warpDreNode: dreReducer.source
				})
			);
		}
	}, [arProvider.walletAddress]);

	return (
		<OrderBookContext.Provider
			value={{
				orderBook,
			}}
		>
			{props.children}
		</OrderBookContext.Provider>
	);
}
