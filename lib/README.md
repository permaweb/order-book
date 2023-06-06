# Orderbook sdk

## Sell an asset

```js
import { OrderBook } from 'permaweb-orderbook';

let orderbook = await OrderBook.init({
	currency: 'U',
	wallet: 'jwk, use_wallet, window.arweaveWallet',
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
import { OrderBook } from 'permaweb-orderbook';

let orderbook = await OrderBook.init({
	currency: 'U',
	wallet: 'jwk, use_wallet, window.arweaveWallet',
});

let orderTx = await orderbook.buy({
	assetId: 'jsDyuWAfDpvng789iOpoG9GJpd91VayNizlFzOyNiRE',
	qty: 1000,
});

console.log(orderTx);
```
