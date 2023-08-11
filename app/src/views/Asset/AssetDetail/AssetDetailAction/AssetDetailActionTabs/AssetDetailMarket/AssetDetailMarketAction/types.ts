import { AssetDetailType } from 'permaweb-orderbook';

export interface IProps {
	asset: AssetDetailType;
	handleUpdate: () => Promise<void>;
	pendingResponse: { tx: string } | null;
	updating: boolean;
}
