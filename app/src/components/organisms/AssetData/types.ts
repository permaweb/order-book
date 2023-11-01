import { AssetType } from 'permaweb-orderbook';

import { AssetRenderType } from 'helpers/types';

export interface IProps {
	asset: AssetType;
	preview?: boolean;
	frameMinHeight?: number;
	autoLoad?: boolean;
	loadRenderer?: boolean;
	assetRender?: AssetRenderType;
}
