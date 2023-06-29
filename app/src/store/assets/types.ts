import { AssetType } from 'permaweb-orderbook';

export type AssetsType = {
	data: AssetType[] | null;
	featuredData?: AssetType[] | null;
};
