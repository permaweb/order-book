import { getGqlDataByIds } from '../gql';
import {
	AssetArgsClientType,
	AssetCreateArgsClientType,
	AssetDetailType,
	AssetsResponseType,
	AssetType,
	BalanceType,
	CONTENT_TYPES,
	FILTERED_IDS,
	getBalancesEndpoint,
	getTagValue,
	GQLResponseType,
	log,
	logValue,
	ORDERBOOK_CONTRACT,
	OrderBookPairOrderType,
	OrderBookPairType,
	STORAGE,
	TAGS,
	TagType,
	UDL_ICONS,
	UDLType,
	UserBalancesType,
} from '../helpers';

export async function createAsset(args: AssetCreateArgsClientType): Promise<string | null> {
	const assetId = await createTransaction({
		arClient: args.arClient,
		content: args.content,
		contentType: args.contentType,
		tags: createTags(args),
	});
	const contractId = await createContract({ arClient: args.arClient, assetId: assetId });
	if (contractId) {
		logValue(`Deployed Contract`, contractId, 0);
		return contractId;
	} else {
		return null;
	}
}

export async function getAssetIdsByContract(args: { arClient: any; filterListings: boolean }): Promise<string[]> {
	try {
		const pairs: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;
		const ids: string[] = [];
		for (let i = 0; i < pairs.length; i++) {
			if (!args.filterListings) ids.push(pairs[i].pair[0]);
			else {
				if (pairs[i].orders && pairs[i].orders.length > 0) {
					ids.push(pairs[i].pair[0]);
				}
			}
		}
		const finalIds = ids.reverse().filter((id: string) => !FILTERED_IDS.includes(id));
		return finalIds;
	} catch (e: any) {
		return [];
	}
}

export async function getAssetIdsByUser(args: {
	arClient: any;
	walletAddress: string;
	filterListings: boolean;
}): Promise<string[]> {
	try {
		const result: any = await fetch(getBalancesEndpoint(args.walletAddress));
		if (result.status === 200) {
			const balances = ((await result.json()) as UserBalancesType).balances;

			const assetIds = balances
				.filter((balance: BalanceType) => {
					return balance.balance && parseInt(balance.balance) !== 0;
				})
				.map((balance: BalanceType) => {
					return balance.contract_tx_id;
				});

			let finalAssetIds = [...assetIds];
			if (args.filterListings) {
				const contractIds = await getAssetIdsByContract({
					arClient: args.arClient,
					filterListings: args.filterListings,
				});
				finalAssetIds = assetIds.filter((id: string) => contractIds.includes(id));
			}

			return finalAssetIds;
		} else {
			return [];
		}
	} catch (e: any) {
		return [];
	}
}

export async function getAssetsByIds(args: AssetArgsClientType): Promise<AssetType[]> {
	const gqlData: AssetsResponseType = await getGqlDataByIds({
		ids: args.ids,
		owner: args.owner,
		uploader: args.uploader,
		cursor: args.cursor,
		reduxCursor: args.reduxCursor,
		arClient: args.arClient,
		walletAddress: args.walletAddress,
		useArweaveBundlr: args.useArweaveBundlr ? args.useArweaveBundlr : false,
	});

	const pairs: OrderBookPairType[] = (await args.arClient.read(ORDERBOOK_CONTRACT)).pairs;

	return getValidatedAssets(gqlData, pairs);
}

export async function getAssetById(args: {
	id: string;
	arClient: any;
	orderBookContract: string;
}): Promise<AssetDetailType> {
	const asset = (
		await getAssetsByIds({
			ids: [args.id],
			owner: null,
			uploader: null,
			cursor: null,
			reduxCursor: null,
			walletAddress: null,
			arClient: args.arClient,
			useArweaveBundlr: true,
		})
	)[0];

	if (asset) {
		const state = await args.arClient.read(args.id);

		let orders = [];
		let orderBookState = await args.arClient.read(args.orderBookContract);
		let pair = orderBookState.pairs.find((p: any) => {
			return p.pair[0] === args.id;
		});
		if (pair) {
			orders = pair.orders.map((order: OrderBookPairOrderType) => {
				return { ...order, currency: pair.pair[1] };
			});
		}
		return { ...asset, state: state, orders: orders };
	} else {
		return null;
	}
}

export function getValidatedAssets(gqlData: AssetsResponseType, pairs?: OrderBookPairType[]): AssetType[] {
	let validatedAssets: AssetType[] = [];
	for (let i = 0; i < gqlData.assets.length; i++) {
		const title = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.title);
		const description = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.description);
		const topic = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.topic);
		const type = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.type);
		const implementation = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.implements);
		const license = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.ans110.license);
		const renderWith = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.renderWith);
		const collectionCode = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.collectionCode);
		const creator = getTagValue(gqlData.assets[i].node.tags, TAGS.keys.creator);

		if (title !== STORAGE.none && description !== STORAGE.none && type !== STORAGE.none) {
			let asset: AssetType = {
				data: {
					id: gqlData.assets[i].node.id,
					title: title,
					description: description,
					topic: topic,
					type: type,
					implementation: implementation,
					license: license,
					renderWith: renderWith ? renderWith : null,
					dateCreated: gqlData.assets[i].node.block
						? gqlData.assets[i].node.block.timestamp * 1000
						: gqlData.assets[i].node.timestamp,
					blockHeight: gqlData.assets[i].node.block ? gqlData.assets[i].node.block.height : 0,
					creator:
						creator && creator !== STORAGE.none
							? creator
							: gqlData.assets[i].node.owner
							? gqlData.assets[i].node.owner.address
							: gqlData.assets[i].node.address,
				},
			};

			if (collectionCode && collectionCode !== STORAGE.none) asset.data.collectionCode = collectionCode;

			const udl = getUDL(gqlData.assets[i]);
			if (udl) asset.data.udl = udl;

			if (pairs) {
				const assetIndex = pairs.findIndex((asset: OrderBookPairType) => asset.pair[0] === gqlData.assets[i].node.id);
				if (assetIndex !== -1) {
					asset.orders = pairs[assetIndex].orders.map((order: OrderBookPairOrderType) => {
						return { ...order, currency: pairs[assetIndex].pair[1] };
					});
				}
			}
			validatedAssets.push(asset);
		}
	}
	return validatedAssets;
}

function getUDL(gqlData: GQLResponseType): UDLType | null {
	const license = getTagValue(gqlData.node.tags, TAGS.keys.udl.license);
	if (!license || license === STORAGE.none) return null; // || !(license.toLowerCase() === UDL_LICENSE_VALUE.toLowerCase())

	let currencyIcon: string;
	let currencyEndText: string;
	const currencyType = getTagValue(gqlData.node.tags, TAGS.keys.udl.currency);
	if (!currencyType || currencyType === STORAGE.none) currencyIcon = UDL_ICONS.u;
	else currencyEndText = currencyType;

	let accessFee = { key: TAGS.keys.udl.accessFee, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.accessFee) };
	let licenseFee = { key: TAGS.keys.udl.licenseFee, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.licenseFee) };
	let derivationFee = {
		key: TAGS.keys.udl.derivationFee,
		value: getTagValue(gqlData.node.tags, TAGS.keys.udl.derivationFee),
	};
	let commercialFee = {
		key: TAGS.keys.udl.commercialFee,
		value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercialFee),
	};

	if (currencyIcon) {
		accessFee['icon'] = currencyIcon;
		derivationFee['icon'] = currencyIcon;
		commercialFee['icon'] = currencyIcon;
		licenseFee['icon'] = currencyIcon;
	}

	if (currencyEndText) {
		accessFee['endText'] = currencyEndText;
		derivationFee['endText'] = currencyEndText;
		commercialFee['endText'] = currencyEndText;
		licenseFee['endText'] = currencyEndText;
	}

	return {
		license: { key: TAGS.keys.udl.license, value: license },
		access: { key: TAGS.keys.udl.access, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.access) },
		accessFee: accessFee,
		commercial: { key: TAGS.keys.udl.commercial, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercial) },
		commercialFee: commercialFee,
		commercialUse: {
			key: TAGS.keys.udl.commercialUse,
			value: getTagValue(gqlData.node.tags, TAGS.keys.udl.commercialUse),
		},
		derivation: { key: TAGS.keys.udl.derivation, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.derivation) },
		derivationFee: derivationFee,
		licenseFee: licenseFee,
		paymentMode: { key: TAGS.keys.udl.paymentMode, value: getTagValue(gqlData.node.tags, TAGS.keys.udl.paymentMode) },
	};
}

function createTags(args: AssetCreateArgsClientType): TagType[] {
	const dateTime = new Date().getTime().toString();

	let initStateJson: any = {
		balances: {
			[args.owner]: 1,
		},
		title: args.title,
		description: args.description,
		ticker: args.ticker,
		dateCreated: dateTime,
		claimable: [],
	};

	if (args.dataProtocol) initStateJson.dataProtocol = args.dataProtocol;
	if (args.dataSource) initStateJson.dataSource = args.dataSource;
	if (args.renderWith) initStateJson.renderWith = args.renderWith.map((renderWith: string) => renderWith);

	initStateJson = JSON.stringify(initStateJson);

	const tags: TagType[] = [
		{ name: TAGS.keys.contractSrc, value: TAGS.values.assetContractSrc },
		{ name: TAGS.keys.smartweaveAppName, value: TAGS.values.smartweaveAppName },
		{ name: TAGS.keys.smartweaveAppVersion, value: TAGS.values.smartweaveAppVersion },
		{ name: TAGS.keys.contentType, value: args.contentType },
		{ name: TAGS.keys.initState, value: initStateJson },
		{ name: TAGS.keys.initialOwner, value: args.owner },
		{ name: TAGS.keys.ans110.title, value: args.title },
		{ name: TAGS.keys.ans110.description, value: args.description },
		{ name: TAGS.keys.ans110.type, value: args.type },
		{ name: TAGS.keys.ans110.implements, value: TAGS.values.ansVersion },
		{ name: TAGS.keys.dateCreated, value: dateTime },
		{ name: TAGS.keys.indexedBy, value: TAGS.values.indexer },
	];

	args.topics.forEach((topic: string) => tags.push({ name: TAGS.keys.topic(topic), value: topic }));

	if (args.dataProtocol) tags.push({ name: TAGS.keys.dataProtocol, value: args.dataProtocol });
	if (args.dataSource) tags.push({ name: TAGS.keys.dataSource, value: args.dataSource });
	if (args.renderWith)
		args.renderWith.forEach((renderWith: string) => tags.push({ name: TAGS.keys.renderWith, value: renderWith }));

	return tags;
}

async function createTransaction(args: { arClient: any; content: any; contentType: string; tags: TagType[] }) {
	let finalContent: any;
	switch (args.contentType) {
		case CONTENT_TYPES.json as any:
			finalContent = JSON.stringify(args.content);
			break;
		default:
			finalContent = args.content;
			break;
	}
	try {
		const txRes = await args.arClient.arweavePost.createTransaction({ data: finalContent }, 'use_wallet');
		args.tags.forEach((tag: TagType) => txRes.addTag(tag.name, tag.value));
		const response = await global.window.arweaveWallet.dispatch(txRes);
		return response.id;
	} catch (e: any) {
		throw new Error(`Error creating transaction ...\n ${e}`);
	}
}

async function createContract(args: { arClient: any; assetId: string }) {
	try {
		const { contractTxId } = await args.arClient.warpDefault.register(args.assetId, 'node2');
		return contractTxId;
	} catch (e: any) {
		logValue(`Error deploying to Warp - Asset ID`, args.assetId, 1);

		const errorString = e.toString();
		if (errorString.indexOf('500') > -1) {
			return null;
		}

		if (errorString.indexOf('502') > -1 || errorString.indexOf('504') > -1 || errorString.indexOf('FetchError') > -1) {
			let retries = 5;
			for (let i = 0; i < retries; i++) {
				await new Promise((r) => setTimeout(r, 2000));
				try {
					log(`Retrying Warp ...`, null);
					const { contractTxId } = await args.arClient.warpDefault.register(args.assetId, 'node2');
					log(`Retry succeeded`, 0);
					return contractTxId;
				} catch (e2: any) {
					logValue(`Error deploying to Warp - Asset ID`, args.assetId, 1);
					continue;
				}
			}
		}
	}

	throw new Error(`Warp retries failed ...`);
}
