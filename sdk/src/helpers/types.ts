export type AssetType = {
	data: {
		id: string
		title: string
		description: string
		topic: string
		type: string
		implementation: string
		renderWith: string | null
		dateCreated: number
		blockHeight: number
	};
	orders?: OrderBookPairOrderType[];
};

export type AssetDetailType = AssetType & {
	state: any;
	orders: any;
};

export type SellArgs = {
	assetId: string;
	price: number;
	qty: number;
	collection?: string;
};

export type BuyArgs = {
	assetId: string;
	spend: number;

};

export type EnvType = {
	orderBookContract: string;
	currency: string;
	currencyContract: string;
	arClient: ArweaveClientType;
	wallet: any;
	walletAddress: string;
};

export type InitArgs = {
	currency: 'U';
	wallet: any;
	walletAddress: string | null;
	arweaveGet: any;
	arweavePost: any;
	warp: any;
};

export type ApiClientInitArgs = {
	arClient: ArweaveClientType;
	orderBookContract: string;
}

export type AssetArgsType = {
	ids: string[] | null;
	owner: string | null;
	uploader: string | null;
	cursor: string | null;
	reduxCursor: string | null;
	walletAddress: string | null;
};

export type AssetArgsClientType = AssetArgsType & {
	arClient: any;
};

export type SearchReturnType = {
	assets: AssetType[];
};

export type SearchArgs = AssetArgsType & {
	term: string,
};

export type ApiClientType = {
	arClient: ArweaveClientType;
	orderBookContract: string;
	init: (args: ApiClientInitArgs) => ApiClientType;
	getAssetsByContract: (args: AssetArgsType) => Promise<AssetType[]>;
	getAssetIdsByContract: () => Promise<string[]>;
	getAssetsByUser: (args: AssetArgsType) => Promise<AssetType[]>;
	getAssetIdsByUser: (args: { walletAddress: string }) => Promise<string[]>;
	getAssetsByIds: (args: AssetArgsType) => Promise<AssetType[]>;
	getAssetById: (args: { id: string }) => Promise<AssetType>;
	getProfile: (args: { walletAddress: string }) => Promise<ProfileType>;
	search:(args: {}) => Promise<SearchReturnType>;
}

export type WriteContractArgs = {
	contract: string;
	wallet: any;
	input: any;
};

export type ValidateAssetArgs = {
	asset: string;
	assetState: any;
	arClient: ArweaveClientType;
};

export type ValidateSellArgs = {
	sellArgs: SellArgs;
	assetState: any;
	orderBookState: any;
	wallet: any;
	walletAddress: string | null;
};

export type ValidateBuyArgs = {
	buyArgs: BuyArgs;
	assetState: any;
	orderBookState: any;
	wallet: any;
	walletAddress: string | null;
	currencyContract: string;
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
	idGQL = 'idGQL'
}

export type CursorObjectKeyType = CursorEnum.GQL | CursorEnum.idGQL | null;

export type GQLResponseType = {
	cursor: string | null;
	node: {
		id: string;
		tags: { [key: string]: any }[];
		data: {
			size: string;
			type: string;
		};
		block: {
			height: number,
			timestamp: number
		}
	};
};

export type TagFilterType = { name: string; values: string[] };

export type AssetsResponseType = {
	nextCursor: string | null;
	previousCursor: string | null;
	assets: GQLResponseType[];
};

export type AGQLResponseType = { data: GQLResponseType[]; nextCursor: string | null };

export type ProfileType = {
	handle: string | null;
	avatar: string | null;
	twitter: string | null;
	discord: string | null;
};
