import { CollectionsSortType } from 'helpers/types';

export interface IProps {
	currentSort: CollectionsSortType;
	setCurrentSort: (sort: CollectionsSortType) => void;
	stampDisabled: boolean;
}
