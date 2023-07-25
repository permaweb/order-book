import { AssetDetailType, AssetType } from 'permaweb-orderbook';

export interface IProps {
	assetId: string;
}

export interface IAProps {
	asset: AssetType;
}

export interface IAMProps {
	asset: AssetDetailType;
	updateAsset: () => Promise<void>;
}