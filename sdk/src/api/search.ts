import { getAssetsResponseObject, getGQLData } from '../gql';
import { AGQLResponseType, ArweaveClientType, AssetType, SearchArgs, SearchReturnType } from '../helpers';
import { getValidatedAssets } from '../api';

function removeDuplicates(assets: AssetType[]): AssetType[] {
    const uniqueAssets: AssetType[] = [];
  
    const ids: Set<string> = new Set();
    for (const asset of assets) {
      if (!ids.has(asset.data.id)) {
        ids.add(asset.data.id);
        uniqueAssets.push(asset);
      }
    }
  
    return uniqueAssets;
}

export async function search (args: SearchArgs & {arClient: ArweaveClientType}) : Promise<SearchReturnType | null>{
    let tagsToSearch = ['Title', 'Description', 'Type'];
    let allValidatedAssets = [];

    try {
        for(let i = 0; i < tagsToSearch.length; i++) {
            let tags = [{
                name: tagsToSearch[i],
                values: [`${args.term}`], 
                match: `FUZZY_OR`
            }];
    
            let result: AGQLResponseType = await getGQLData({
                ids: null,
                tagFilters: tags,
                uploader: args.uploader,
                cursor: args.cursor,
                reduxCursor: args.reduxCursor,
                cursorObject:null,
                arClient: args.arClient,
            });
    
            let ar = getAssetsResponseObject(result);
            let validatedAssets = getValidatedAssets(ar);
    
            allValidatedAssets = allValidatedAssets.concat(validatedAssets);
        }
    } catch (e: any) {
        console.log(e);
    }

    return {
        assets: removeDuplicates(allValidatedAssets)
    };
}
