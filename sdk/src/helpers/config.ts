export const ORDERBOOK_CONTRACT = 'tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg';

export const CURRENCY_DICT = {
	U: 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw',
};

export const PAGINATOR = 100;

export const STORAGE = {
	none: 'N/A',
};

export const CURSORS = {
	p1: 'P1',
	end: 'END',
};

export const SEARCH = {
	idTerm: '`*',
	ownerTerm: '`%',
};

export const TAGS = {
	keys: {
		ans110: {
			title: 'Title',
			description: 'Description',
			topic: 'Topic:*',
			type: 'Type',
			implements: 'Implements',
			license: 'License',
		},
		banner: 'Banner',
		collectionCode: 'Collection-Code',
		contentType: 'Content-Type',
		contractSrc: 'Contract-Src',
		creator: 'Creator',
		dataProtocol: 'Data-Protocol',
		dataSource: 'Data-Source',
		dateCreated: 'Date-Created',
		indexedBy: 'Indexed-By',
		initialOwner: 'Initial-Owner',
		initState: 'Init-State',
		name: 'Name',
		protocolName: 'Protocol-Name',
		uploaderTxId: 'Uploader-Tx-Id',
		renderWith: 'Render-With',
		rootSource: 'Root-Source',
		smartweaveAppName: 'App-Name',
		smartweaveAppVersion: 'App-Version',
		thumbnail: 'Thumbnail',
		topic: (topic: string) => `topic:${topic}`,
		udl: {
			access: 'Access',
			accessFee: 'Access-Fee',
			commercial: 'Commercial',
			commercialFee: 'Commercial-Fee',
			commercialUse: 'Commercial-Use',
			currency: 'Currency',
			derivation: 'Derivation',
			derivationFee: 'Derivation-Fee',
			license: 'License',
			licenseFee: 'License-Fee',
			paymentMode: 'Payment-Mode',
		},
	},
	values: {
		ansVersion: 'ANS-110',
		assetContractSrc: 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ',
		collection: 'Collection',
		comment: 'comment',
		contentTypes: {
			textPlain: 'text/plain',
		},
		indexer: 'ucm',
		profileVersions: {
			'0.2': 'Account-0.2',
			'0.3': 'Account-0.3',
		},
		smartweaveAppName: 'SmartWeaveContract',
		smartweaveAppVersion: '0.3.0',
	},
};

export const CONTENT_TYPES = {
	json: 'application/json',
	textPlain: 'text/plain',
};

export const DEFAULT_COLLECTION_BANNER =
	'https://pfyk3jkw3r37rwor3gknr5t4p2drukyqiyicauhtamrg7oyikt5a.arweave.net/eXCtpVbcd_jZ0dmU2PZ8focaKxBGECBQ8wMib7sIVPo';
export const DEFAULT_COLLECTION_THUMB =
	'https://ssnc6hvdhwdqgyy5lze2dd2ndfvw3ula73sd4ib2unf5svmw4y4q.arweave.net/lJovHqM9hwNjHV5JoY9NGWtt0WD-5D4gOqNL2VWW5jk';

export const UDL_LICENSE_VALUE = 'udlicense';

export const UDL_ICONS = {
	ar: 'AR',
	u: 'U',
};

export const BUNDLR_CONFIG = {
	currency: 'arweave',
	node: 'https://node2.bundlr.network',
};
