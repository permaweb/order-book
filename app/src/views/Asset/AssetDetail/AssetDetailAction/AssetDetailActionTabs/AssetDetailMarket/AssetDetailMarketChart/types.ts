import { AssetType } from 'permaweb-orderbook';

import { OwnerListingType, OwnerType } from 'helpers/types';

export interface IProps {
	asset: AssetType;
	owners: OwnerType[] | OwnerListingType[];
}
