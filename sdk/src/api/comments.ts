import { getGQLData } from '../gql';
import {
	ArweaveClientType,
	CommentDetailType,
	CommentsResponseType,
	CommentType,
	CursorEnum,
	getTagValue,
	getTxEndpoint,
	TAGS,
} from '../helpers';

export async function getComments(args: {
	arClient: ArweaveClientType;
	id: string;
	cursor: string;
}): Promise<CommentsResponseType> {
	const gqlData = await getGQLData({
		ids: null,
		tagFilters: [
			{
				name: TAGS.keys.contentType,
				values: [TAGS.values.contentTypes.textPlain],
			},
			{
				name: TAGS.keys.dataProtocol,
				values: [TAGS.values.comment],
			},
			{
				name: TAGS.keys.dataSource,
				values: [args.id],
			},
		],
		uploader: null,
		cursor: args.cursor,
		reduxCursor: null,
		cursorObject: CursorEnum.GQL,
		arClient: args.arClient,
		useArweaveBundlr: true,
	});

	const comments: CommentType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		const node = gqlData.data[i].node;
		comments.push({
			id: node.id,
			dataSource: getTagValue(node.tags, TAGS.keys.dataSource),
			owner: node.owner ? node.owner.address : node.address,
		});
	}

	return {
		comments: comments,
		nextCursor: gqlData.nextCursor,
		previousCursor: null,
	};
}

export async function getCommentData(args: { arClient: ArweaveClientType; id: string }): Promise<CommentDetailType> {
	const comment = await fetch(getTxEndpoint(args.id));
	return {
		text: await comment.text(),
	};
}
