import { AssetType } from 'permaweb-orderbook';

import { AssetTableType, CursorType } from 'helpers/types';

export interface IProps {
	assets: AssetType[] | null;
	cursors: CursorType;
	handleCursorFetch: (cursor: string | null) => void;
	header?: string;
	recordsPerPage: number;
	showPageNumbers: boolean;
	tableType: AssetTableType;
	showNoResults: boolean;
}
