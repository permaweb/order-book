import { CURSORS, GATEWAYS, PAGINATOR } from 'helpers/config';
import { AGQLResponseType, GQLArgsType, GQLNodeResponseType } from 'helpers/types';
import { store } from 'store';

export async function getGQLData(args: GQLArgsType): Promise<AGQLResponseType> {
	let data: GQLNodeResponseType[] = [];
	let count: number = 0;
	let nextCursor: string | null = null;

	if (args.ids && !args.ids.length) {
		return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
	}

	try {
		const response = await fetch(`https://${args.gateway}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: getQuery(args),
		});
		const responseJson = await response.json();
		if (responseJson.data.transactions.edges.length) {
			data = [...responseJson.data.transactions.edges];
			count = responseJson.data.transactions.count ?? 0;

			const lastResults: boolean = data.length < PAGINATOR || !responseJson.data.transactions.pageInfo.hasNextPage;

			if (lastResults) nextCursor = CURSORS.end;
			else nextCursor = data[data.length - 1].cursor;

			return getGQLResponseObject(args, {
				data: data,
				count: count,
				nextCursor: nextCursor,
				previousCursor: null,
			});
		} else {
			return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
		}
	} catch (e: any) {
		console.error(e);
		return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
	}
}

function getQuery(args: GQLArgsType): string {
	const ids = args.ids ? JSON.stringify(args.ids) : null;
	const tagFilters = args.tagFilters ? JSON.stringify(args.tagFilters).replace(/"([^"]+)":/g, '$1:') : null;
	const owners = args.owners ? JSON.stringify(args.owners) : null;
	const cursor = args.cursor ? `"${args.cursor}"` : null;
	const count = args.gateway === GATEWAYS.goldsky && !args.cursor ? 'count' : '';
	const block = args.minBlock
		? `block: {
			min: ${args.minBlock}
		}`
		: '';

	const query = {
		query: `
                query {
                    transactions(
                        ids: ${ids},
                        tags: ${tagFilters},
						first: ${PAGINATOR}
                        owners: ${owners},
                        after: ${cursor},
						${block}
                    ){
					${count}
					pageInfo {
						hasNextPage
					}
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
							owner {
								address
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

	return JSON.stringify(query);
}

export function getGQLResponseObject(args: GQLArgsType, gqlResponse: AGQLResponseType): AGQLResponseType {
	let cursorState: any;
	if (args.reduxCursor) {
		cursorState = store.getState().cursorsReducer[args.cursorObjectKey][args.reduxCursor];
	}

	let nextCursor: string | null = cursorState ? cursorState.next : null;
	let previousCursor: string | null = cursorState ? cursorState.previous : null;

	return {
		data: gqlResponse.data,
		count: gqlResponse.count,
		nextCursor: nextCursor,
		previousCursor: previousCursor,
	};
}

export * from './activity';
export * from './assets';
export * from './collections';
export * from './profiles';
