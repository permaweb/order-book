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
