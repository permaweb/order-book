export interface IProps {
	assetId: string;
	title: string;
	stamps: { total: number; vouched: number } | null;
	getCount?: boolean;
}
