




export default class Collection {
    id: string;

    constructor(args:{ id: string }) {
        this.id = args.id;
    }

    async list() {
        if(!this.id) {
            throw new Error(`Please provide a collection id in the constructor`)
        }
        // fetch and list all assets in the collection

    }

}