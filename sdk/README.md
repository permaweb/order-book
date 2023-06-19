# Orderbook sdk

## Sell an asset

```js
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';
import { OrderBook } from 'permaweb-orderbook';

let arweave = Arweave.init({
	host: 'arweave.net',
	port: 443,
	protocol: 'https,
	timeout: 40000,
	logging: false,
});

let warp = WarpFactory.forMainnet({
	...defaultCacheOptions,
	inMemory: true,
});

let orderbook = OrderBook.init({
	currency: 'U',
	wallet: 'jwk, use_wallet, window.arweaveWallet',
	// optionally, you can specify a different instance for querying/posting
	// for example if you want to post to arweave.net and retrieve from goldsky
	// here we are using the same instance
	arweaveGet: arweave,
	arweavePost: arweave,
	warp: warp
});

let orderTx = await orderbook.sell({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	price: 1,
	qty: 1000,
});

console.log(orderTx);
```

## Buy an asset

```js
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';
import { OrderBook } from 'permaweb-orderbook';

let arweave = Arweave.init({
	host: 'arweave.net',
	port: 443,
	protocol: 'https,
	timeout: 40000,
	logging: false,
});

let warp = WarpFactory.forMainnet({
	...defaultCacheOptions,
	inMemory: true,
});

let orderbook = OrderBook.init({
	currency: 'U',
	wallet: 'jwk, use_wallet, window.arweaveWallet',
	// optionally, you can specify a different instance for querying/posting
	// for example if you want to post to arweave.net and retrieve from goldsky
	// here we are using the same instance
	arweaveGet: arweave,
	arweavePost: arweave,
	warp: warp
});

let orderTx = await orderbook.sell({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	qty: 1000,
});

console.log(orderTx);
```
