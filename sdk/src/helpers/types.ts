export type AssetType = {
	data: {
		id: string;
		title: string;
		description: string;
		topic: string;
		type: string;
		implementation: string;
		license: string;
		renderWith: string | null;
		dateCreated: number;
		blockHeight: number;
		udl?: UDLType;
	};
	orders?: OrderBookPairOrderType[];
	stamps?: { total: number; vouched: number };
};

export type LicenseValueType = {
	key: string;
	value: string;
	icon?: string;
	endText?: string;
};

export type UDLType = {
	license: LicenseValueType;
	access: LicenseValueType;
	accessFee: LicenseValueType;
	derivation: LicenseValueType;
	derivationFee: LicenseValueType;
	commercial: LicenseValueType;
	commercialFee: LicenseValueType;
	paymentMode: LicenseValueType;
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
	wallet: any;
	walletAddress: string | null;
};

export type BuyArgs = {
	assetId: string;
	spend: number;
	wallet: any;
	walletAddress: string | null;
};

export type CancelArgs = {
	orderId: string;
	wallet: any;
	walletAddress: string | null;
};

export type EnvType = {
	orderBookContract: string;
	currency: string;
	currencyContract: string;
	arClient: ArweaveClientType;
};

export type InitArgs = {
	currency: 'U';
	arweaveGet: any;
	arweavePost: any;
	warp: any;
	warpDreNode: string;
};

export type ApiClientInitArgs = {
	arClient: ArweaveClientType;
	orderBookContract: string;
};

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

export type GetCollectionsArgs = {
	arClient: any;
};

export type GetCollectionArgs = {
	arClient: any;
	collectionId: string;
};

export type SearchReturnType = {
	assets: AssetType[];
};

export type SearchArgs = AssetArgsType & {
	term: string;
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
	search: (args: {}) => Promise<SearchReturnType>;
	getCollections: (args: { cursor: string | null }) => Promise<CollectionsResponseType>;
	getCollection: (args: { collectionId: string }) => Promise<CollectionAssetType>;
};

export type WriteContractArgs = {
	contract: string;
	wallet: any;
	input: any;
	options?: any;
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
};

export type ValidateBuyArgs = {
	buyArgs: BuyArgs;
	assetState: any;
	orderBookState: any;
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
	warpDreNode: string;
};

export type ArweaveClientType = {
	init: (args: ArweaveClientInitArgs) => ArweaveClientType;
	arweaveGet: any;
	arweavePost: any;
	warpDefault: any;
	writeContract: (args: WriteContractArgs) => Promise<any>;
	read: (id: string) => Promise<any>;
	options: any;
};

export type OrderBookType = {
	env: EnvType;
	init: (args: InitArgs) => OrderBookType;
	sell: (args: SellArgs) => Promise<any>;
	buy: (args: BuyArgs) => Promise<any>;
	cancel: (args: CancelArgs) => Promise<any>;
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
};

export enum CursorEnum {
	GQL = 'gql',
	idGQL = 'idGQL',
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
			height: number;
			timestamp: number;
		};
		owner: {
			address: string;
		};
	};
};

export type TagFilterType = { name: string; values: string[] };

export type AssetsResponseType = {
	nextCursor: string | null;
	previousCursor: string | null;
	assets: GQLResponseType[];
};

export type CollectionsResponseType = {
	nextCursor: string | null;
	previousCursor: string | null;
	collections: CollectionType[];
};

export type AGQLResponseType = { data: GQLResponseType[]; nextCursor: string | null };

export type ProfileType = {
	handle: string | null;
	avatar: string | null;
	twitter: string | null;
	discord: string | null;
	walletAddress?: string;
};

export type CollectionType = {
	id: string;
	banner: string;
	thumbnail: string;
	name: string;
	title: string;
	description: string;
	type: string;
	author: {
		address: string;
		handle?: string | null;
	};
	stamps?: { total: number; vouched: number };
};

export type CollectionAssetType = CollectionType & {
	assets: string[];
};

export type CollectionManifestType = {
	type: string;
	items: string[];
};
