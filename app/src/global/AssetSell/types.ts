import { AssetDetailType } from 'permaweb-orderbook';

export interface IProps {
    asset: AssetDetailType;
    updateAsset: () => Promise<void>;
}