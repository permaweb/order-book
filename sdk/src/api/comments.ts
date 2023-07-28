import { getGQLData } from "../gql";
import { ArweaveClientType, CommentType, CommentsResponseType, CursorEnum, TAGS, getTagValue } from "../helpers";

function buildComment(node: any) {


    let comment: CommentType = {
        tx: node.id,
        rootTx: getTagValue(node.tags, TAGS.keys.rootSource),
        owner: node.owner.address,
    };

    return comment;
}

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
		comments.push(buildComment(node));
	}

    return {
        comments: [],
        nextCursor: gqlData.nextCursor,
        previousCursor: null
    };
}