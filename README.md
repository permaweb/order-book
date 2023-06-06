# Permaweb Order Book
- [Permaweb Order Book](#permaweb-order-book)
  - [Setup](#setup)
  - [Local](#local)
  - [Format (TODO)](#format-todo)


An order book is where owners can list their assets for sale at a specific price, for a specific token. For example, I want to sell my Jack Russell Moonshot NFT for 1 RebAR, within a given window of time. (A limit order). 

The first thing I need to do, is to let the OB Contract know that I can exchange a `JR NFT` with `RebAR`, using the `addPair` function. This function is idempotent and associates the `JR NFT` contract with `RebAR`.

I can call the `allow` function on my contract to allow for the OrderBook contract to have the authority to transfer my asset to a buyer who is willing to provide 1 RebAR in return. Once the `allow` function is complete, then I call the `createOrder` function on the OB Contract. This contract will call `claim` on the JR NFT contract transfering the balance of tokens to its contract address. And the order will be listed in the order book.

A buyer comes in to buy the `JR NFT` contract, they create a purchase order with `RebAR` by first calling `allow` on `RebAR` and then calling `createOrder` on the `OrderBook` contract.

## Setup

- `npm i` in the root will install packages in all directories.

## Local

- `npm run start-arlocal`
- `npm run local` (outputs contract id)

If you'd like to check that the contract is deployed and the state is correct:

- `npm run read-state-local -- <contract-id>`

## Format (TODO)

This will format the entire repo.

- `npm run format`