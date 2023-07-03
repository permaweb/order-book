# Orderbook sdk

## Initialize

Optionally when initializing, you can specify a different instance of arweave for querying/posting, for example if you want to post to arweave.net and retrieve from goldsky. Below we are using the same instance for both.

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
	arweaveGet: arweave,
	arweavePost: arweave,
	warp: warp
});
```

Limit Sell Market Buy
Limit Buy Market Sell


## Sell an asset

```js
// Limit sell
let orderTx = await orderbook.sell({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	// price in sub $U
	price: 1000000,
	// quantity of asset
	qty: 1,
});

// Sell an asset at the market price
// If a buy order exists it will fill automatically
let orderTx = await orderbook.sell({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	// quantity of asset
	qty: 1,
});

console.log(orderTx);
```

## Buy an asset

```js

let orderTx = await orderbook.buy({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	// amount of sub $U to spend
	spend: 1000,
});

console.log(orderTx);
```
