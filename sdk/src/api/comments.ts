import { getGQLData } from "../gql";
import { ArweaveClientType, CommentDetailType, CommentType, CommentsResponseType, CursorEnum, TAGS, getTagValue, getTxEndpoint } from "../helpers";

export async function getComments(args: {arClient: ArweaveClientType, id: string, cursor: string}) : Promise<CommentsResponseType> {
    let gqlData = await getGQLData({
		ids: null,
		tagFilters: [
            { 
                name: TAGS.keys.contentType, 
                values: [TAGS.values.contentTypes.textPlain] 
            },
            {
				name: TAGS.keys.dataProtocol,
				values: [TAGS.values.comment],
			},
            {
                name: TAGS.keys.dataSource,
                values: [args.id]
            }
		],
		uploader: null,
		cursor: args.cursor,
		reduxCursor: null,
		cursorObject: CursorEnum.GQL,
		arClient: args.arClient,
	});

    let comments: CommentType[] = [];
	for (let i = 0; i < gqlData.data.length; i++) {
		let node = gqlData.data[i].node;
		comments.push({
            tx: node.id,
            rootTx: getTagValue(node.tags, TAGS.keys.rootSource),
            owner: node.owner.address,
        });
	}

    return {
        comments: [],
        nextCursor: gqlData.nextCursor,
        previousCursor: null
    };
}

export async function getComment(args: { arClient: ArweaveClientType, id: string }) : Promise<CommentDetailType> {
    let comment = await fetch(getTxEndpoint(args.id));
    return {
        text: await comment.text(),
    };
}