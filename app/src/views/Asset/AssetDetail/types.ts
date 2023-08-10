import { AssetDetailType, AssetType } from 'permaweb-orderbook';

export interface IProps {
	assetId: string;
}

export interface IAProps {
	asset: AssetType;
}

export interface IAMProps {
	asset: AssetType | AssetDetailType;
	handleUpdate: ((orderBookResponse: any) => Promise<void>) | ((id: string) => void);
}

export interface IADProps extends IAMProps {
	pendingResponse: { tx: string } | null;
	updating: boolean;
}
