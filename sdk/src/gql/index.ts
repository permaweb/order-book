import { BUNDLR_CONFIG, CURSORS, PAGINATOR } from '../helpers/config';
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
	arClient: ArweaveClientType;
	minBlock?: number;
	useArweaveNet?: boolean;
	useArweaveBundlr?: boolean;
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

	const block = args.minBlock
		? `block: {
			min: ${args.minBlock}
		}`
		: '';

	const first = args.useArweaveBundlr ? '' : `first: ${PAGINATOR}`;
	const nodeFields = args.useArweaveBundlr
		? `address timestamp`
		: `data {
				size
				type
			}
			owner {
				address
			}
			block {
				height
				timestamp
			}`;

	const query = {
		query: `
                query {
                    transactions(
                        ids: ${ids},
                        tags: ${tags},
						${first}
                        owners: ${owners},
                        after: ${cursor},
						${block}
                    ){
                    edges {
                        cursor
                        node {
                            id
                            tags {
                                name 
                                value 
                            }
							${nodeFields}
                        }
                    }
                }
            }
        `,
	};

	const response = await getResponse({
		arClient: args.arClient,
		query: query,
		useArweaveBundlr: args.useArweaveBundlr ? args.useArweaveBundlr : false,
		useArweaveNet: args.useArweaveNet ? args.useArweaveNet : false,
	});

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

async function getResponse(args: { arClient: any; query: any; useArweaveBundlr: boolean; useArweaveNet: boolean }) {
	if (args.useArweaveBundlr) return await useFetch({ query: args.query, endpoint: `${BUNDLR_CONFIG.node}/graphql` });
	else if (args.useArweaveNet) return await args.arClient.arweavePost.api.post('/graphql', args.query);
	else return await args.arClient.arweaveGet.api.post('/graphql', args.query);
}

async function useFetch(args: { query: string; endpoint: string }) {
	const response = await fetch(args.endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(args.query),
	});
	try {
		return { data: await response.json() };
	} catch (e: any) {
		console.error(e);
		return { data: [] };
	}
}

export * from './assets';
