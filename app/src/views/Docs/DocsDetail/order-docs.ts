export const docsOrder = [
	{
		name: 'Introduction',
		path: 'introduction',
	},
	{
		name: 'Geting started on the permaweb',
		path: 'getting-started',
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
				name: 'U token ($U)',
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
				name: 'BazAR/UCM explained',
				path: 'bazar-built-on-ucm',
			},
			{
				name: 'Uploading content to BazAR (UCM)',
				path: 'upload-content-to-ucm',
			},
			{
				name: 'Universal Data License (UDL) explained',
				path: 'universal-data-license',
			},
		],
	},
];
