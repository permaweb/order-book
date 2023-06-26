import { getGQLData } from '../gql';
import { ArweaveClientType, SearchArgs, SearchReturnType } from '../helpers';

export async function search (args: SearchArgs & {arClient: ArweaveClientType}) : Promise<SearchReturnType>{
	let tags = [{
        name: 'Title',
        values: [`${args.term}`], 
        match: `FUZZY_OR`
    }];

    try {
        let result = await getGQLData({
            ids: null,
            tagFilters: tags,
            uploader: args.uploader,
            cursor: args.cursor,
            reduxCursor: args.reduxCursor,
            cursorObject:null,
            arClient: args.arClient,
        });

        let res = result.data.map((r: any) => {return r.node.id});

        return res;
    } catch (e: any) {
        console.log(e);
    }
	

    return {};
}
