import { SelectOptionType } from 'helpers/types';

export interface IProps {
	activeOption: SelectOptionType;
	setActiveOption: (option: SelectOptionType) => void;
	options: SelectOptionType[];
	disabled: boolean;
}
