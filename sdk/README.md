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
	arweaveGet: arweaveGet,
	arweavePost: arweavePost,
	warp: warp,
	warpDreNode: 'https://dre-1.warp.cc/contract'
});
```

Limit Sell Market Buy
Limit Buy Market Sell


## Sell an asset

```js
// Limit sell
let orderTx = await orderbook.sell({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	qty: 10, // quantity of asset to sell
	price: unitPrice, // unit price in subunits 
	wallet: "use_wallet",
	walletAddress: walletAddress
});

console.log(orderTx);
```

## Buy an asset

```js

let orderTx = await orderbook.buy({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	// amount of sub $U to spend
	spend: 1000,
	wallet: "use_wallet",
	walletAddress: walletAddress
});

console.log(orderTx);
```
