import { AssetType } from 'permaweb-orderbook';

export type AssetsType = {
	contractData?: AssetType[] | null;
	featuredData?: AssetType[] | null;
	accountData?: AssetType[] | null;
	collectionData?: AssetType[] | null;
};
