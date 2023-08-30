export interface IProps {
	owner: any;
	asset: any;
	isSaleOrder: boolean;
	handleUpdate: any;
	loading: boolean;
	hideOrderCancel: boolean;
	useCallback?: () => void;
}
