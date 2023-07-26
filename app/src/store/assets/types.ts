import { AssetType } from 'permaweb-orderbook';

export type AssetsType = {
	contractData?: AssetType[] | null;
	featuredData?: AssetType[] | null;
	accountData?: {
		address: string | null;
		data: AssetType[] | null;
	};
	collectionData?: AssetType[] | null;
};
