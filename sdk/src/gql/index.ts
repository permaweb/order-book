import { CURSORS, PAGINATOR } from '../helpers/config';
import {
	AGQLResponseType,
	ArweaveClientType,
	CursorEnum,
	CursorObjectKeyType,
	GQLResponseType,
	TagFilterType,
} from '../helpers/types';
import { unquoteJsonKeys } from '../helpers/utils';

export async function getGQLData(args: {
	ids: string[] | null;
	tagFilters: TagFilterType[] | null;
	uploader: string | null;
	cursor: string | null;
	reduxCursor: string | null;
	cursorObject: CursorObjectKeyType;
	useArweavePost?: boolean;
	arClient: ArweaveClientType;
}): Promise<AGQLResponseType> {
	const data: GQLResponseType[] = [];
	let nextCursor: string | null = null;

	if (args.ids && args.ids.length <= 0) {
		return { data: data, nextCursor: nextCursor };
	}

	let ids = args.ids ? JSON.stringify(args.ids) : null;
	let tags = args.tagFilters ? unquoteJsonKeys(args.tagFilters) : null;
	let owners = args.uploader ? JSON.stringify([args.uploader]) : null;
	let cursor = args.cursor ? `"${args.cursor}"` : null;

	const query = {
		query: `
                query {
                    transactions(
                        ids: ${ids},
                        tags: ${tags},
                        owners: ${owners},
                        first: ${PAGINATOR}, 
                        after: ${cursor}
                    ){
                    edges {
                        cursor
                        node {
                            id
                            tags {
                                name 
                                value 
                            }
                            data {
                                size
                                type
                            }
							block {
								height
								timestamp
							}
                        }
                    }
                }
            }
        `,
	};

	const response = args.useArweavePost
		? await args.arClient.arweavePost.api.post('/graphql', query)
		: await args.arClient.arweaveGet.api.post('/graphql', query);
	if (response.data.data) {
		const responseData = response.data.data.transactions.edges;
		if (responseData.length > 0) {
			data.push(...responseData);
			if (args.cursorObject && args.cursorObject === CursorEnum.GQL) {
				if (responseData.length < PAGINATOR) {
					nextCursor = CURSORS.end;
				} else {
					nextCursor = responseData[responseData.length - 1].cursor;
				}
			}
		}
	}

	return { data: data, nextCursor: nextCursor };
}

export * from './assets';
