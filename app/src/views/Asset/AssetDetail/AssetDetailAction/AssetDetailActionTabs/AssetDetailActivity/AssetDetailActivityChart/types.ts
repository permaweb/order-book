import { ActivityElementType, AssetType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetType | null;
	activity: ActivityElementType[] | null;
}
