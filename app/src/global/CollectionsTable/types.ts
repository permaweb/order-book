import { CollectionType } from 'permaweb-orderbook';

export interface IProps {
	collections: CollectionType[] | null;
	recordsPerPage: number;
	reduxCursor: string;
	showPageNumbers: boolean;
}
