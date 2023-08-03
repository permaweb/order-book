import { getGQLData } from '../gql';
import {
	ActivityElementType,
	ActivityResponseType,
	ArweaveClientType,
	CursorEnum,
	getTagValue,
	TAGS,
} from '../helpers';

export async function getActivity(args: { arClient: ArweaveClientType; id: string }): Promise<ActivityResponseType> {
	const gqlData = await getGQLData({
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.dataSource,
				values: [args.id],
			},
		],
		uploader: null,
		cursor: null,
		reduxCursor: null,
		cursorObject: CursorEnum.GQL,
		arClient: args.arClient,
		useArweaveBundlr: true,
	});

	const activity: ActivityElementType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		const node = gqlData.data[i].node;
		activity.push({
			id: node.id,
			dataProtocol: getTagValue(node.tags, TAGS.keys.dataProtocol),
			dataSource: getTagValue(node.tags, TAGS.keys.dataSource),
			dateCreated: node.timestamp,
			owner: node.owner ? node.owner.address : node.address,
			protocolName: getTagValue(node.tags, TAGS.keys.protocolName),
		});
	}

	return {
		activity: activity,
		nextCursor: gqlData.nextCursor,
		previousCursor: null,
	};
}
