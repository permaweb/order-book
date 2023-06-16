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

export type RenderType = 'renderer' | 'raw'
export type ContentType = 'renderer' | 'image/png'

export type AssetRenderType = {
	url: string,
	type: RenderType
	contentType: ContentType
}