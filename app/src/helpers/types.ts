import { CommentType } from 'permaweb-orderbook';

export type URLViewType = {
	label: string;
	disabled: boolean;
	url: any;
	view: React.ComponentType;
};

export interface IURLView {
	exchange: URLViewType[];
}

export type NotificationType = 'success' | 'warning' | 'neutral';
export type ResponseType = { status: boolean; message: string | null };

export type ButtonType = 'primary' | 'alt1' | 'alt2' | 'alt3' | 'success' | 'warning';

export type MintStatusType = 'pending' | 'confirmed';

export type RefType = { current: HTMLElement };

export type RenderType = 'renderer' | 'raw';
export type ContentType = 'renderer' | any;

export type AssetRenderType = {
	url: string;
	type: RenderType;
	contentType: ContentType;
};

export type ReduxActionType = {
	type: string;
	payload: any;
};

export type CursorType = {
	next: string | null;
	previous: string | null;
};

export type AssetTableType = 'grid' | 'list';

export type APIFetchType = 'contract' | 'user' | 'collection';

export type ValidationType = {
	status: boolean;
	message: string | null;
};

export type FormFieldType = 'number' | 'password';

export type OwnerType = {
	address: string;
	handle: string | null;
	avatar: string | null;
	balance: number;
	ownerPercentage: number;
};

export type OwnerListingType = {
	address: string;
	handle: string | null;
	avatar: string | null;
	sellQuantity: number;
	sellPercentage: number;
	sellUnitPrice: number;
};

export type DateType = 'iso' | 'epoch';

export type DREObjectType = { label: string; source: string };

export type StepType = 'prev' | 'next';

export type TabType = 'primary' | 'alt1';

export enum WalletEnum {
	arConnect = 'arconnect',
	arweaveApp = 'arweave.app',
}

export type FinalCommentType = CommentType & { ownerDetail: OwnerType | OwnerListingType };

export type SequenceType = {
	start: number;
	end: number;
};

export type CollectionsSortType = 'new' | 'stamps';

export type AssetFilterType = 'listings';

export type SelectOptionType = { id: AssetSortType; label: string };

export enum CursorEnum {
	idGQL = 'idGQL',
	GQL = 'GQL',
}

export type CursorObjectKeyType = CursorEnum.idGQL | CursorEnum.GQL | null;

export type CursorObjectType = {
	key: CursorObjectKeyType;
	value: string;
};

export type TagFilterType = { name: string; values: string[] };

export type GQLNodeResponseType = {
	cursor: string | null;
	node: {
		id: string;
		tags: { [key: string]: any }[];
		data: {
			size: string;
			type: string;
		};
		block?: {
			height: number;
			timestamp: number;
		};
		owner?: {
			address: string;
		};
		address?: string;
		timestamp?: number;
	};
};

export type AGQLResponseType = {
	data: GQLNodeResponseType[];
	count: number;
	nextCursor: string | null;
	previousCursor: string | null;
};

export type ProfileType = {
	handle: string | null;
	avatar: string | null;
	twitter: string | null;
	discord: string | null;
	walletAddress: string;
};

export type GQLArgsType = {
	gateway: string;
	ids: string[] | null;
	tagFilters: TagFilterType[] | null;
	owners: string[] | null;
	cursor: string | null;
	reduxCursor: string | null;
	cursorObjectKey: CursorObjectKeyType;
	minBlock?: number;
};

export type AssetSortType = 'recently-listed' | 'low-to-high' | 'high-to-low' | 'by-stamps';

export type GQLArgsSortType = GQLArgsType & {
	activeSort: AssetSortType;
};

export type CollectionFetchArgs = {
	collectionId: string;
	filterListings: boolean;
	activeSort: AssetSortType;
};

export type CollectionType = {
	id: string;
	banner: string;
	thumbnail: string;
	name: string;
	title: string;
	description: string;
	type: string;
	creator: ProfileType;
	block: { height: number; timestamp: number };
	stamps?: { total: number; vouched: number };
	floorPrice: number | null;
};

export type CollectionAssetType = CollectionType & {
	assets?: string[];
};

export type CollectionManifestType = {
	type: string;
	items: string[];
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
	licenseFee: LicenseValueType;
	derivation: LicenseValueType;
	derivationFee: LicenseValueType;
	commercial: LicenseValueType;
	commercialFee: LicenseValueType;
	commercialUse: LicenseValueType;
	paymentMode: LicenseValueType;
};

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
		holderTitle: string | null;
		dateCreated: number;
		blockHeight: number;
		creator: string;
		thumbnail: string | null;
		collectionCode?: string;
		udl?: UDLType;
	};
	orders?: OrderBookPairOrderType[];
	stamps?: {
		total: number;
		vouched: number;
	};
};

export type CollectionsResponseType = {
	nextCursor: string | null;
	previousCursor: string | null;
	collections: CollectionType[];
};

export type AssetDetailType = AssetType & {
	state: any;
	orders: any;
};
