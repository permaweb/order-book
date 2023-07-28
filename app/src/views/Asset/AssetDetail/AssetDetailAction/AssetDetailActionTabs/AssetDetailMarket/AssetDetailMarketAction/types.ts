import { AssetDetailType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetDetailType;
	handleUpdate: () => Promise<void>;
}
