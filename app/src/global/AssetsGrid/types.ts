import { AssetType } from 'permaweb-orderbook';

export interface IProps {
	assets: AssetType[] | null;
	autoLoad: boolean;
}
