import { AssetType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetType;
	updateAsset: () => Promise<void>;
}
