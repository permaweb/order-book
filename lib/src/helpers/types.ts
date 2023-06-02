
export type SellArgs = {
	assetId: string,
    price: number,
	qty: number,
    collection?: string,
};

export type BuyArgs = {
    assetId: string,
	qty: number,
};

export type EnvType = {
	orderBookContract: string,
	currency: string,
	currencyContract: string,
	arClient: ArweaveClientType,
	wallet: any
};


export type InitArgs = {
	currency: "U",
	wallet: any
}

export type WriteContractArgs = {
	contract: string,
	wallet: any,
	input: any
}

export type ValidateArgs = {
	asset: string,
	assetState: any
}

export type TransactionFlowArgs = {
	from: string,
	to: string,
	orderBookState: any,
	arClient: ArweaveClientType,
	env: EnvType
}

export type ArweaveClientType = {
	init: () => ArweaveClientType,
	arweaveGet: any,
	arweavePost: any,
	warpDefault: any,
	writeContract: (args: WriteContractArgs) => Promise<any>,
	read: (id: string) => Promise<any>,
	warpPluginArweaveSigner: (wallet: any) => any,
	warpPluginInjectedArweaveSigner: (wallet: any) => any,
};

export type OrderBookType = {
	env: EnvType,
	init: (args: InitArgs) => Promise<OrderBookType>,
	sell: (args: SellArgs) => Promise<any>,
	buy: (args: BuyArgs) => Promise<any>,
	validateAsset: (args: ValidateArgs) => Promise<void>,
};
