import { AssetType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetType;
	handleUpdate: (orderBookResponse: any) => Promise<void>;
}
