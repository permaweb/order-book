export interface IProps {
	streak: { days: number; lastHeight: number };
	pixlBalance: number;
	owner: {
		address: string;
		handle: string | null;
	};
	handlePress: () => void;
}
