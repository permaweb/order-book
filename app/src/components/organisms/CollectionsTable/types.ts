import { CollectionType } from 'permaweb-orderbook';

import { CursorType } from 'helpers/types';

export interface IProps {
	collections: CollectionType[] | null;
	recordsPerPage: number;
	reduxCursor: string;
	showPageNumbers: boolean;
	cursors: CursorType;
	handlePageFetch: (cursor: string | null) => void;
}
