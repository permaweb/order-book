import { getGQLData } from "../gql";
import { STORAGE, TAGS } from "./config";
import { 
    ValidateAssetArgs, 
    ValidateBuyArgs, 
    ValidateSellArgs 
} from "./types";
import { getTagValue } from "./utils";



export async function validateSell(args: ValidateSellArgs) {
    // validate that number is an integer
    // verify that they are selling all or less than their balance
    // validate they aren't selling the same single asset twice
    // if asset is already up for sell dont let them resell for more than the left available balance
}

export async function validateBuy(args: ValidateBuyArgs) {
    // validate that number is an integer
    // if it is a single unit token, verify that 
    // the spend is the full price 
    // otherwise if it is a multi unit token 
    // verify the spend is within bounds 
    // dont allow the same buy twice
    // if its multi unit it should always start with the lowest unit price and go up from there
}

export async function validateAsset(args: ValidateAssetArgs) {
    // validate collection if provided
    // validate contract

    if (!args.assetState) {
        throw new Error(`Could not retrieve state for the asset`);
    }

    if (!args.assetState.claimable) {
        throw new Error(`No claimable array found in the asset state`);
    }

    if (!args.assetState.balances) {
        throw new Error(`No balances object found in the asset state`);
    }

    let keys = Object.keys(args.assetState.balances);
      if(keys.length < 1) {
        throw new Error(`balances object is empty in the asset state`);
    }

    let gateway = args.arClient.arweavePost.api.config.host;
    let protocol = args.arClient.arweavePost.api.config.protocol;
    
    const assetResponse = await fetch(`${protocol}://${gateway}/${args.asset}`);

    if(!(assetResponse.status == 200)) {
        throw new Error(`Asset data could not be retrieved`);
    }

    let assetGqlResponse = await getGQLData({
            ids: [args.asset],
            tagFilters: null,
            uploader: null,
            cursor: null,
            reduxCursor: null,
            cursorObject: null,
            arClient: args.arClient
    });

    if(assetGqlResponse.data.length < 1) {
        throw new Error(`Asset could not be found via gql`);
    }

    let ansTitle = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.title);
    let ansDescription = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.description);
    let ansType = getTagValue(assetGqlResponse.data[0].node.tags, TAGS.keys.ans110.type);

    if((ansTitle === STORAGE.none) || (ansDescription === STORAGE.none) || (ansType === STORAGE.none)) {
        throw new Error(`Asset must contain ANS-110 tags - Title, Description, and Type `);
    }
}