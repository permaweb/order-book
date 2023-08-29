import { AssetType } from 'permaweb-orderbook';

import { APIFetchType, AssetTableType } from 'helpers/types';

export interface IProps {
	assets: AssetType[] | null;
	reduxCursor: string;
	apiFetch: APIFetchType;
	header?: string;
	recordsPerPage: number;
	showPageNumbers: boolean;
	tableType: AssetTableType;
	showNoResults: boolean;
	loading: boolean;
	address?: string;
	collectionId?: string;
	getFeaturedData: boolean;
	showFilters: boolean;
	autoLoadRenderers?: boolean;
}
