import { AssetType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetType;
	preview?: boolean;
	frameMinHeight?: number;
	autoLoad?: boolean;
}
