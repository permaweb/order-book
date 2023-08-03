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

	const response = await getResponse({
		arClient: args.arClient,
		useArweaveBundlr: args.useArweaveBundlr ? args.useArweaveBundlr : false,
		useArweaveNet: args.useArweaveNet ? args.useArweaveNet : false,
		ids: ids,
		tags: tags,
		owners: owners,
		cursor: cursor,
		after: cursor,
		block: block,
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

async function getResponse(args: {
	arClient: any;
	useArweaveBundlr: boolean;
	useArweaveNet: boolean;
	ids: any;
	tags: any;
	owners: any;
	cursor: any;
	after: any;
	block: any;
}) {
	const { useArweaveBundlr, useArweaveNet, arClient, ids, tags, owners, cursor, after, block } = args;

	const endpoints = [
		{
			enabled: useArweaveBundlr,
			execute: async () => {
				const response = await fetch(`${BUNDLR_CONFIG.node}/graphql`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(
						getQuery({
							useArweaveBundlr: true,
							ids,
							tags,
							owners,
							cursor,
							after,
							block,
						})
					),
				});
				return { data: await response.json() };
			},
		},
		{
			enabled: useArweaveNet,
			execute: () =>
				arClient.arweavePost.api.post(
					'/graphql',
					getQuery({
						useArweaveBundlr: false,
						ids,
						tags,
						owners,
						cursor,
						after,
						block,
					})
				),
		},
		{
			enabled: true,
			execute: () =>
				arClient.arweaveGet.api.post(
					'/graphql',
					getQuery({
						useArweaveBundlr: false,
						ids,
						tags,
						owners,
						cursor,
						after,
						block,
					})
				),
		},
	];

	for (const endpoint of endpoints) {
		if (endpoint.enabled) {
			try {
				return await endpoint.execute();
			} catch (error: any) {
				console.error(error);
				return { data: [] };
			}
		}
	}

	console.error('All endpoints failed');
	return { data: [] };
}

function getQuery(args: {
	ids: any;
	tags: any;
	owners: any;
	cursor: any;
	after: any;
	block: any;
	useArweaveBundlr: boolean;
}) {
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
                        ids: ${args.ids},
                        tags: ${args.tags},
						${first}
                        owners: ${args.owners},
                        after: ${args.cursor},
						${args.block}
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

	return query;
}

export * from './assets';
