export const docsOrder = [
	{
		name: 'Introduction',
		path: 'introduction',
	},
	{
		name: 'Getting started on the permaweb',
		path: 'new-to-permaweb',
		children: [
			{
				name: 'Create an Arweave wallet',
				path: 'creating-a-wallet',
			},
			{
				name: 'Get vouched',
				path: 'getting-vouched',
			},
			{
				name: 'Customize a permaweb profile',
				path: 'creating-a-permaweb-profile',
			},
		],
	},
	{
		name: 'Permaweb concepts',
		path: 'permaweb-concepts',
		children: [
			{
				name: 'Atomic asset',
				path: 'atomic-asset',
			},
			{
				name: 'Profit sharing token (PST)',
				path: 'profit-sharing-token',
			},
			{
				name: '$U token',
				path: 'u-token',
			},
			{
				name: 'Pixel token ($PIXL)',
				path: 'pixel-token',
			},
			{
				name: 'Stamp token ($STAMP)',
				path: 'stamp-token',
			},
		],
	},
	{
		name: 'Exploring BazAR',
		path: 'exploring-bazar',
		children: [
			{
				name: 'What is BazAR and UCM?',
				path: 'bazar-built-on-ucm',
			},
			{
				name: 'Uploading content to BazAR (UCM)',
				path: 'upload-content-to-ucm',
			},
			{
				name: 'What is the Universal Data License (UDL)?',
				path: 'universal-data-license',
			},
		],
	},
];
