import { AssetDetailType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetDetailType;
	handleUpdate: (orderBookResponse: any) => Promise<void>;
}
