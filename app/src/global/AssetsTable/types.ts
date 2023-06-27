import { AssetType } from 'permaweb-orderbook';

import { ApiFetchType, AssetTableType } from 'helpers/types';

export interface IProps {
	assets: AssetType[] | null;
	reduxCursor: string;
	apiFetch: ApiFetchType;
	header?: string;
	recordsPerPage: number;
	showPageNumbers: boolean;
	tableType: AssetTableType;
	showNoResults: boolean;
}
