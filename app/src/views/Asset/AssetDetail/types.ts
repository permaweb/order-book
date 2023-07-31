import { AssetDetailType, AssetType } from 'permaweb-orderbook';

export interface IProps {
	assetId: string;
}

export interface IAProps {
	asset: AssetType;
}

export interface IAMProps {
	asset: AssetType | AssetDetailType;
	handleUpdate: (() => Promise<void>) | ((id: string) => void);
}
