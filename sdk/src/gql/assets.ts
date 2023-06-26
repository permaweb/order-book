import { CURSORS, STORAGE, TAGS } from '../helpers/config';
import { AGQLResponseType, AssetArgsClientType, AssetsResponseType, CursorEnum, GQLResponseType } from '../helpers/types';
import { checkGqlCursor, getTagValue } from '../helpers/utils';

import { getGQLData } from '.';

export async function getGqlDataByIds(args: AssetArgsClientType): Promise<AssetsResponseType> {
	const artifacts: AGQLResponseType = await getGQLData({
		ids: args.ids,
		tagFilters: null,
		uploader: args.uploader,
		cursor: null,
		reduxCursor: args.reduxCursor,
		cursorObject: CursorEnum.idGQL,
		arClient: args.arClient
	});

	return getAssetsResponseObject(artifacts);
}

function getAssetsResponseObject(gqlResponse: AGQLResponseType): AssetsResponseType {
	const assets = gqlResponse.data.filter((element: GQLResponseType) => {
		return getTagValue(element.node.tags, TAGS.keys.uploaderTxId) === STORAGE.none;
	});

	return {
		nextCursor: gqlResponse.nextCursor,
		previousCursor: null,
		assets: assets,
	};
}
