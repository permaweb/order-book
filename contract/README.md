# OrderBook Contract

## Developers

``` sh
yarn
yarn test
yarn build
yarn deploy
```

## Summary

The orderbook contract is a standalone contract that is built to trade PST + FCP 2 atomic tokens.

A PST is a SmartWeave Contract that has a `balances` object and `transfer` and `balance` functions. It allows both wallets and contracts to hold token balances. Also a `name` and `ticker` property for composability.

A FCP2 (Foreign Call Protocol 2) is a SmartWeave Contract that not only contains the characteristics of a PST, but includes `allow` and `claim` functions, with a `claimable` array, that allows token balance holders to allow or provide permission for others to `claim` tokens from them. This is a useful mechanism for an orderbook.

This project includes an orderbook, for FCP2 atomic tokens, these tokens can be applied to digital assets as well as digital tokens.

## How does it work?

### Initialize the swap pair by calling `addPair`

```js
await write(ORDERBOOK_CONTRACT, { function: 'addPair', pair: [ASSET, TOKEN]})
```

The addPair function sets up the ability to trade an asset for a token. This only needs to be called one time.

## Sell a digital asset

### Allow 

Seller of the asset needs to allow the orderbook to claim the quantity of tokens they want to sell.

```js
const { originalTxId } = await write(ASSET_CONTRACT, { function: 'allow', target: ORDERBOOK_CONTRACT, qty: 10000 })
```

### CreateOrder

Seller now needs to call the orderbook to create their sells order

```js
await write(ORDERBOOK_CONTRACT, { function: 'createOrder', transaction: originalTxId, qty: 1000, price: 1})
```

## Buy a digital asset with U

Buyer needs to allow the orderbook to claim the quantity of the tokens they would like to use to purchase the asset.

```js
const { originalTxId } = await write(TOKEN_CONTRACT, { function: 'allow', target: ORDERBOOK_CONTRACT, qty : 1000 })
```

### CreateOrder

Buy needs to complete the purchase by calling createOrder on the orderbook contract

```js
await write(ORDERBOOK_CONTRACT, { function: 'createOrder', transaction: originalTxId, qty: 1000 })
```

---

You should also be able to reverse these flows, so a buyer could make an offer to buy x amount of an asset for y amount of U Tokens. And the seller could accept the offer and basically reverse the flow.

---

If for some reason the seller gets cold feet, they can cancel the order.

```js
await write(ORDERBOOK_CONTRACT, { function: 'cancelOrder', orderID: ORDERID })
```

> NOTE:
>
> One thing to note, don't use remoteStateSyncEnabled when working with this contract, it really confuses the state, for some reason the remote DRE does not update the last internalWrites, I think there is a bug with the DRE and multiple internalWrites, so I would recommend you sync state on load, then make these calls without remoteStateSync enabled.