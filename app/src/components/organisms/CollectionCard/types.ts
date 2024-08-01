import { CollectionType } from 'permaweb-orderbook';

export interface IProps {
	collection: CollectionType;
	hideRedirect?: boolean;
	getStampCount?: boolean;
	showMigration?: boolean;
	migrationRunning?: boolean;
	handleMigrate?: () => void;
	disableMigrate?: boolean;
	buttonMessage: string;
}
