export type AssetType = {
	data: {
		id: string
		title: string
		description: string
		topic: string
		type: string
		implementation: string
		renderWith: string | null
	};
	orders?: OrderBookPairOrderType[];
};

export type SellArgs = {
	assetId: string;
	price: number;
	qty: number;
	collection?: string;
};

export type BuyArgs = {
	assetId: string;
	qty: number;
};

export type EnvType = {
	orderBookContract: string;
	currency: string;
	currencyContract: string;
	arClient: ArweaveClientType;
	wallet: any;
};

export type InitArgs = {
	currency: 'U';
	wallet: any;
	arweaveGet: any;
	arweavePost: any;
	warp: any;
};

export type ApiClientInitArgs = {
	arClient: ArweaveClientType;
}

export type GetAssetsByUserArgs = {
	walletAddress: string;
}

export type ApiClientType = {
	arClient: ArweaveClientType;
	init: (args: ApiClientInitArgs) => ApiClientType;
	getAssetsByContract: () => Promise<AssetType[]>;
	getAssetsByUser: (args: GetAssetsByUserArgs) => Promise<AssetType[]>;
}

export type WriteContractArgs = {
	contract: string;
	wallet: any;
	input: any;
};

export type ValidateArgs = {
	asset: string;
	assetState: any;
};

export type TransactionFlowArgs = {
	from: string;
	to: string;
	orderBookState: any;
	arClient: ArweaveClientType;
	env: EnvType;
};

export type ArweaveClientInitArgs = {
	arweaveGet: any;
	arweavePost: any;
	warp: any;
}

export type ArweaveClientType = {
	init: (args: ArweaveClientInitArgs) => ArweaveClientType;
	arweaveGet: any;
	arweavePost: any;
	warpDefault: any;
	writeContract: (args: WriteContractArgs) => Promise<any>;
	read: (id: string) => Promise<any>;
};

export type OrderBookType = {
	env: EnvType;
	init: (args: InitArgs) => OrderBookType;
	sell: (args: SellArgs) => Promise<any>;
	buy: (args: BuyArgs) => Promise<any>;
	validateAsset: (args: ValidateArgs) => Promise<void>;
	api: ApiClientType;
};

export type PagingType = {
	limit: number;
	items: number;
	page: number;
};

export type BalanceType = {
	contract_tx_id: string;
	token_ticker: string;
	token_name: string;
	balance: string;
	sort_key: string;
};

export type UserBalancesType = {
	paging: PagingType;
	balances: BalanceType[];
};

export type OrderBookPairType = {
	pair: [string, string];
	orders: OrderBookPairOrderType[];
};

export type OrderBookPairOrderType = {
	creator: string;
	id: string;
	originalQuantity: number;
	price: number;
	quantity: number;
	token: string;
	transfer: string;
	currency?: string;
}

export enum CursorEnum {
	GQL = 'gql',
	Search = 'search',
}

export type CursorObjectKeyType = CursorEnum.GQL | CursorEnum.Search | null;

export type GQLResponseType = {
	cursor: string | null;
	node: {
		id: string;
		tags: { [key: string]: any }[];
		data: {
			size: string;
			type: string;
		};
	};
};

export type TagFilterType = { name: string; values: string[] };

export type AssetArgsType = {
	ids: string[] | null;
	owner: string | null;
	uploader: string | null;
	cursor: string | null;
	reduxCursor: string | null;
	arClient: ArweaveClientType;
};

export type AssetsResponseType = {
	nextCursor: string | null;
	previousCursor: string | null;
	assets: GQLResponseType[];
};

export type AGQLResponseType = { data: GQLResponseType[]; nextCursor: string | null };
