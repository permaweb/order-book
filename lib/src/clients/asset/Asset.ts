



type SellArgs = {
    price: number, 
    window:{
        start: number, 
        end: number
    },
    collection?: string
};

export default class Asset {
    id: string;

    constructor(args:{ id: string }) {
        this.id = args.id;
    }

    async sell(args: SellArgs) {
        // for existing id
        // validate time window
        // validate collection if provided
        // validate contract
        // validate asset data (not 404)
        // validate tags
        // create orderbook limit order

    }

    async buy() {
        
    }

}