

export const TAGS = {
	keys: {
		ansTitle: 'Title',
		ansDescription: 'Description',
		ansTopic: 'Topic',
		ansType: 'Type',
		ansImplements: 'Implements',
		application: 'Application',
		appName: 'App-Name',
		appType: 'App-Type',
		appVersion: 'App-Version',
		description: 'Description',
		implements: 'Implements',
		initialOwner: 'Initial-Owner',
		initState: 'Init-State',
		license: 'License',
		profileImage: 'Profile-Image',
		protocolName: 'Protocol-Name',
		contractSrc: 'Contract-Src',
		contentType: 'Content-Type',
		timestamp: 'Timestamp',
		title: 'Title',
		topic: (topic: string) => `Topic:${topic}`,
		type: 'Type',
		renderWith: 'Render-With',
		uploaderTxId: 'Uploader-Tx-Id',
	},
	values: {
		ansTypes: {
			socialPost: 'social-post',
			webPage: 'web-page',
			image: 'image',
			video: 'video',
			music: 'music',
			document: 'document',
			file: 'file',
			collection: 'collection',
		},
		application: 'Asset Market.',
		appName: 'SmartWeaveContract',
		appVersion: '0.3.0',
		license: 'x5UYiin_eRB0XCpZAkpduL0JIaXAUe9Bi2-RXGloBQI',
		ansVersion: 'ANS-110',
		ansType: 'token',
		profileVersions: {
			'0.2': 'Account-0.2',
			'0.3': 'Account-0.3',
		},
	},
};

export const PAGINATOR = 100;

export const CURSORS = {
	p1: 'P1',
	end: 'END',
};

export const SEARCH = {
	cursorPrefix: 'searchCursor',
	idTerm: '`*',
	ownerTerm: '`%',
};

export const STORAGE = {
	none: 'N/A',
};

export const RENDER_WITH_VALUES = [];
