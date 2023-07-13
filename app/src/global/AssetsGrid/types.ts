import { AssetType } from 'permaweb-orderbook';

export interface IProps {
	assets: AssetType[] | null;
	autoLoad: boolean;
	loaderCount: number;
	loading: boolean;
	title: string;
}
