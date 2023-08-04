import { CollectionType } from 'permaweb-orderbook';

export interface IProps {
	collection: CollectionType;
	hideRedirect?: boolean;
	getStampCount?: boolean;
}
