import { CURSORS, GATEWAY_CONFIG, PAGINATOR, UPLOAD_CONFIG } from '../helpers/config';
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
	owners?: string[];
	reduxCursor: string | null;
	cursorObject: CursorObjectKeyType;
	arClient: ArweaveClientType;
	minBlock?: number;
	useArweaveNet?: boolean;
	useGoldsky?: boolean;
	useArweaveBundlr?: boolean;
	customPaginator?: number;
}): Promise<AGQLResponseType> {
	const data: GQLResponseType[] = [];
	let nextCursor: string | null = null;

	if (args.ids && args.ids.length <= 0) {
		return { data: data, nextCursor: nextCursor };
	}

	let ids = args.ids ? JSON.stringify(args.ids) : null;
	let tags = args.tagFilters ? unquoteJsonKeys(args.tagFilters) : null;
	let owners = args.uploader ? JSON.stringify([args.uploader]) : args.owners ? JSON.stringify(args.owners) : null;
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
		useGoldsky: args.useGoldsky ? args.useGoldsky : false,
		ids: ids,
		tags: tags,
		owners: owners,
		cursor: cursor,
		after: cursor,
		block: block,
		customPaginator: args.customPaginator ? args.customPaginator : null,
	});

	if (response.data.data) {
		const responseData = response.data.data.transactions.edges;
		if (responseData.length > 0) {
			data.push(...responseData);
			if (args.cursorObject && args.cursorObject === CursorEnum.GQL) {
				const paginator = args.customPaginator ? args.customPaginator : PAGINATOR;
				const lastResults: boolean = responseData.length < paginator;
				let endCheck: boolean = false;
				if (responseData.length === paginator) {
					const checkedCursor = `"${responseData[responseData.length - 1].cursor}"`;
					const checkedResponse = await getResponse({
						arClient: args.arClient,
						useArweaveBundlr: args.useArweaveBundlr ? args.useArweaveBundlr : false,
						useArweaveNet: args.useArweaveNet ? args.useArweaveNet : false,
						useGoldsky: args.useGoldsky ? args.useGoldsky : false,
						ids: null,
						tags: tags,
						owners: owners,
						cursor: checkedCursor,
						after: checkedCursor,
						block: block,
						customPaginator: args.customPaginator ? args.customPaginator : null,
					});

					let checkedResponseData = [];
					if (checkedResponse.data.data) checkedResponseData = checkedResponse.data.data.transactions.edges;
					endCheck = checkedResponseData.length <= 0;
				}

				if (lastResults || endCheck) {
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
	useGoldsky: boolean;
	ids: any;
	tags: any;
	owners: any;
	cursor: any;
	after: any;
	block: any;
	customPaginator: number | null;
}) {
	const { useArweaveBundlr, useGoldsky, arClient, ids, tags, owners, cursor, after, block, customPaginator } = args;

	const fetchArweaveNet = async () =>
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
				customPaginator,
			})
		);

	// const fetchGoldsky = async () =>
	// 	arClient.arweaveGet.api.post(
	// 		'/graphql',
	// 		getQuery({
	// 			useArweaveBundlr: false,
	// 			ids,
	// 			tags,
	// 			owners,
	// 			cursor,
	// 			after,
	// 			block,
	// 			customPaginator,
	// 		})
	// 	);

	const fetchGoldsky = async () => {
		try {
			const response = await fetch(`${GATEWAY_CONFIG.node}/graphql`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					getQuery({
						useArweaveBundlr: false,
						ids,
						tags,
						owners,
						cursor,
						after,
						block,
						customPaginator,
					})
				),
			});
			const responseData = await response.json();
			const responseLength = responseData.data.transactions.edges.length;
			if (responseLength > 0) return { data: responseData };
			else return await fetchArweaveNet();
		} catch (error: any) {
			console.warn(error);
			return await fetchArweaveNet();
		}
	};

	const fetchBundlr = async () => {
		try {
			const response = await fetch(`${UPLOAD_CONFIG.node}/graphql`, {
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
						customPaginator,
					})
				),
			});
			const responseData = await response.json();
			const responseLength = responseData.data.transactions.edges.length;
			if (responseLength > 0) return { data: responseData };
			else return await fetchArweaveNet();
		} catch (error: any) {
			console.warn(error);
			return await fetchArweaveNet();
		}
	};

	const endpoints = [
		{
			enabled: useArweaveBundlr,
			execute: async () => {
				return await fetchBundlr();
			},
		},
		{
			enabled: useGoldsky ? !useGoldsky : true,
			execute: async () => {
				return await fetchArweaveNet();
			},
		},
		{
			enabled: useGoldsky,
			execute: async () => {
				return await fetchGoldsky();
			},
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
}

function getQuery(args: {
	ids: any;
	tags: any;
	owners: any;
	cursor: any;
	after: any;
	block: any;
	useArweaveBundlr: boolean;
	customPaginator: number | null;
}) {
	const first = args.useArweaveBundlr ? '' : `first: ${args.customPaginator ? args.customPaginator : PAGINATOR}`;
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
