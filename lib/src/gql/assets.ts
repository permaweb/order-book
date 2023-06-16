import { CURSORS, STORAGE, TAGS } from '../helpers/config';
import { AGQLResponseType, AssetArgsType, AssetsResponseType, CursorEnum, GQLResponseType } from '../helpers/types';
import { checkGqlCursor, getTagValue } from '../helpers/utils';

import { getGQLData } from '.';

export async function getAssetsByIds(args: AssetArgsType): Promise<AssetsResponseType> {
	let cursor: string | null = null;
	if (args.cursor && args.cursor !== CURSORS.p1 && args.cursor !== CURSORS.end && !checkGqlCursor(args.cursor)) {
		cursor = args.cursor;
	}

	const artifacts: AGQLResponseType = await getGQLData({
		ids: args.ids,
		tagFilters: null,
		uploader: args.uploader,
		cursor: cursor,
		reduxCursor: args.reduxCursor,
		cursorObject: CursorEnum.Search,
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
