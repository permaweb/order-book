import { connect, createDataItemSigner, dryrun, message, results } from '@permaweb/aoconnect';
import Arweave from 'arweave';

import { AssetType, CollectionType, getTagValue, getTxEndpoint, TagType } from 'permaweb-orderbook';

import { getGQLData } from 'gql';
import { getAssetById } from 'gql/assets';
import {
	AO,
	API_CONFIG,
	CONTENT_TYPES,
	DEFAULT_UCM_BANNER,
	DEFAULT_UCM_THUMBNAIL,
	GATEWAYS,
	TAGS,
} from 'helpers/config';
import { ProfileHeaderType } from 'helpers/types';

const arweave = Arweave.init({
	host: GATEWAYS.arweave,
	protocol: API_CONFIG.protocol,
	port: API_CONFIG.port,
	timeout: API_CONFIG.timeout,
	logging: API_CONFIG.logging,
});

function convertToLuaTable(obj) {
	const entries = Object.entries(obj).map(([key, value]) => `['${key}'] = ${value}`);
	return `{ ${entries.join(', ')} }`;
}

export async function readHandler(args: {
	processId: string;
	action: string;
	tags?: TagType[];
	data?: any;
}): Promise<any> {
	const tags = [{ name: 'Action', value: args.action }];
	if (args.tags) tags.push(...args.tags);

	const response = await dryrun({
		process: args.processId,
		tags: tags,
		data: JSON.stringify(args.data || {}),
	});

	if (response.Messages && response.Messages.length) {
		if (response.Messages[0].Data) {
			return JSON.parse(response.Messages[0].Data);
		} else {
			if (response.Messages[0].Tags) {
				return response.Messages[0].Tags.reduce((acc: any, item: any) => {
					acc[item.name] = item.value;
					return acc;
				}, {});
			}
		}
	}
}

export async function getProfileByWalletAddress(args: { address: string }): Promise<ProfileHeaderType | null> {
	const emptyProfile = {
		id: null,
		walletAddress: args.address,
		displayName: null,
		username: null,
		bio: null,
		avatar: null,
		banner: null,
	};

	try {
		const profileLookup = await readHandler({
			processId: AO.profileRegistry,
			action: 'Get-Profiles-By-Delegate',
			data: { Address: args.address },
		});

		let activeProfileId: string;
		if (profileLookup && profileLookup.length > 0 && profileLookup[0].ProfileId) {
			activeProfileId = profileLookup[0].ProfileId;
		}

		if (activeProfileId) {
			const fetchedProfile = await readHandler({
				processId: activeProfileId,
				action: 'Info',
				data: null,
			});

			if (fetchedProfile) {
				return {
					id: activeProfileId,
					walletAddress: fetchedProfile.Owner || null,
					displayName: fetchedProfile.Profile.DisplayName || null,
					username: fetchedProfile.Profile.UserName || null,
					bio: fetchedProfile.Profile.Description || null,
					avatar: fetchedProfile.Profile.ProfileImage || null,
					banner: fetchedProfile.Profile.CoverImage || null,
				};
			} else return emptyProfile;
		} else return emptyProfile;
	} catch (e: any) {
		throw new Error(e);
	}
}

export async function uploadToAO(asset: AssetType, collectionId?: string, collectionName?: string) {
  let mainProfile = await getProfileByWalletAddress({ address: asset.data.creator });

  if(!mainProfile || !mainProfile.id) {
    throw new Error('Could not locate ao profile.')
  }

	let fetchedAsset = await getGQLData({
		gateway: GATEWAYS.arweave,
		ids: [asset.data.id],
		tagFilters: null,
		owners: null,
		cursor: null,
		reduxCursor: null,
		cursorObjectKey: null,
	});

  if(!fetchedAsset || !fetchedAsset.data || (fetchedAsset.data.length < 1)) throw new Error('Asset not found on gateway');

	let licenseTag = fetchedAsset.data[0].node.tags.filter((tag) => tag.name === 'License');
	let licenseTagVal = licenseTag.length > 0 ? { name: TAGS.keys.license, value: TAGS.values.license } : null;

	let tags: TagType[] = fetchedAsset.data[0].node.tags
		.filter((tag) => {
			return (
				tag.name !== 'App-Name' &&
				tag.name !== 'App-Version' &&
				tag.name !== 'Contract-Src' &&
				tag.name !== 'Contract-Manifest' &&
				tag.name !== 'Init-State' &&
				tag.name !== 'Collection-Code' &&
				tag.name !== 'License'
			);
		})
		.map((tag) => {
			return {
				name: tag.name,
				value: tag.value,
			};
		});
	tags.push({ name: 'Migrated-From', value: asset.data.id });

	if (collectionId) {
		tags.push({ name: TAGS.keys.collectionId, value: collectionId });
	}

	if (collectionName) {
		tags.push({ name: TAGS.keys.collectionName, value: collectionName });
	}

	if (licenseTagVal) {
		tags.push(licenseTagVal);
	}

	let processSrc = null;

	const processSrcFetch = await fetch(getTxEndpoint(AO.assetSrc));
	if (processSrcFetch.ok) {
		processSrc = await processSrcFetch.text();
	} else {
		throw new Error('Failed to fetch process source');
	}

	processSrc = processSrc.replace('[Owner]', `['${asset.data.creator}']`);
	processSrc = processSrc.replaceAll(`'<NAME>'`, `[[${asset.data.title}]]`);
	processSrc = processSrc.replaceAll('<TICKER>', 'ATOMIC');
	processSrc = processSrc.replaceAll('<DENOMINATION>', '1');
	processSrc = processSrc.replaceAll('<BALANCE>', '1');

	const buffer: any = new Buffer(await (await fetch(getTxEndpoint(asset.data.id))).arrayBuffer());

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  if (buffer.length > MAX_SIZE) {
      throw new Error('Asset size exceeds 10MB');
  }

	const aos = connect();

	let processId = await aos.spawn({
		module: AO.module,
		scheduler: AO.scheduler,
		signer: createDataItemSigner(globalThis.arweaveWallet),
		tags: tags,
		data: buffer,
	});

	let fetchedAssetId: string;
	let retryCount = 0;
	while (!fetchedAssetId) {
		await new Promise((r) => setTimeout(r, 2000));
		const gqlResponse = await getGQLData({
			gateway: GATEWAYS.goldsky,
			ids: [processId],
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: null,
		});

		if (gqlResponse && gqlResponse.data.length) {
			console.log(`Fetched transaction:`, gqlResponse.data[0].node.id);
			fetchedAssetId = gqlResponse.data[0].node.id;
		} else {
			console.log(`Transaction not found:`, processId);
			retryCount++;
			if (retryCount >= 10) {
				throw new Error(`Transaction not found after 10 attempts, process deployment retries failed`);
			}
		}
	}

	if (fetchedAssetId) {
		const evalMessage = await aos.message({
			process: processId,
			signer: createDataItemSigner(globalThis.arweaveWallet),
			tags: [{ name: 'Action', value: 'Eval' }],
			data: processSrc,
		});

		const evalResult = await aos.result({
			message: evalMessage,
			process: processId,
		});

		if (evalResult) {
			let assetState = (await getAssetById({ id: asset.data.id })).state;
			let balances = {};

			for (let key in assetState.balances) {
				let profile = await getProfileByWalletAddress({ address: key });
				if (profile.id) {
					balances[profile.id] = assetState.balances[key];
				} else {
					balances[key] = assetState.balances[key];
				}
			}

			const luaTable = convertToLuaTable(balances);

			await aos.message({
				process: processId,
				signer: createDataItemSigner(globalThis.arweaveWallet),
				tags: [{ name: 'Action', value: 'Eval' }],
				data: `Balances = ${luaTable}`,
			});

      let creatorBalance = assetState.balances[asset.data.creator];
      let balance = '';
      if(creatorBalance) {
        balance = creatorBalance.toString();
      }

      await aos.message({
        process: processId,
        signer: createDataItemSigner(globalThis.arweaveWallet),
        tags: [
          { name: 'Action', value: 'Add-Asset-To-Profile' },
          { name: 'ProfileProcess', value: mainProfile.id },
          { name: 'Quantity', value: balance },
        ],
        data: JSON.stringify({ Id: processId, Quantity: balance }),
      });
		}

		return processId;
	} else {
		throw new Error('Error fetching from gateway');
	}
}

export async function createTransaction(args: { content: any; contentType: string; tags: TagType[] }) {
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
		const txRes = await arweave.createTransaction({ data: finalContent }, 'use_wallet');
		args.tags.forEach((tag: TagType) => txRes.addTag(tag.name, tag.value));
		const response = await global.window.arweaveWallet.dispatch(txRes);
		return response.id;
	} catch (e: any) {
		throw new Error(`Error creating transaction ...\n ${e}`);
	}
}

async function uploadCollection(collection: CollectionType, profileId: string) {
	let bannerTx: any = null;
	if (!collection.banner.includes(DEFAULT_UCM_BANNER)) {
		bannerTx = collection.banner;
	}
	let thumbnailTx: any = null;
	if (!collection.thumbnail.includes(DEFAULT_UCM_THUMBNAIL)) {
		thumbnailTx = collection.thumbnail;
	}

	const dateTime = new Date().getTime().toString();

	const collectionTags: TagType[] = [
		{ name: TAGS.keys.contentType, value: CONTENT_TYPES.json },
		{ name: TAGS.keys.creator, value: await window.arweaveWallet.getActiveAddress() },
		{
			name: TAGS.keys.ans110.title,
			value: collection.title,
		},
		{
			name: TAGS.keys.ans110.description,
			value: collection.description,
		},
		{ name: TAGS.keys.ans110.type, value: TAGS.values.document },
		{ name: TAGS.keys.dateCreated, value: dateTime },
		{
			name: TAGS.keys.name,
			value: collection.name,
		},
		{ name: TAGS.keys.profileCreator, value: profileId },
		{ name: 'Action', value: 'Add-Collection' },
		{ name: 'Migrated-From', value: collection.id },
	];

	if (bannerTx) collectionTags.push({ name: TAGS.keys.banner, value: bannerTx });
	if (thumbnailTx) collectionTags.push({ name: TAGS.keys.thumbnail, value: thumbnailTx });

	const aos = connect();

	let processSrc = null;

	try {
		const processSrcFetch = await fetch(getTxEndpoint(AO.collectionSrc));
		if (processSrcFetch.ok) {
			processSrc = await processSrcFetch.text();
		}
	} catch (e: any) {
		console.error(e);
	}

	if (processSrc) {
		processSrc = processSrc.replaceAll(`'<NAME>'`, `[[${collection.title}]]`);
		processSrc = processSrc.replaceAll(`'<DESCRIPTION>'`, `[[${collection.description}]]`);
		processSrc = processSrc.replaceAll('<CREATOR>', profileId);
		processSrc = processSrc.replaceAll('<BANNER>', bannerTx ? bannerTx : DEFAULT_UCM_BANNER);
		processSrc = processSrc.replaceAll('<THUMBNAIL>', thumbnailTx ? thumbnailTx : DEFAULT_UCM_THUMBNAIL);

		processSrc = processSrc.replaceAll('<DATECREATED>', dateTime);
		processSrc = processSrc.replaceAll('<LASTUPDATE>', dateTime);
	}

	let processId: string;
	let retryCount = 0;
	const maxRetries = 25;

	while (!processId && retryCount < maxRetries) {
		try {
			processId = await aos.spawn({
				module: AO.module,
				scheduler: AO.scheduler,
				signer: createDataItemSigner(globalThis.arweaveWallet),
				tags: collectionTags,
			});
			console.log(`Collection process: ${processId}`);
		} catch (e: any) {
			console.error(`Spawn attempt ${retryCount + 1} failed:`, e);
			retryCount++;
			if (retryCount < maxRetries) {
				await new Promise((r) => setTimeout(r, 1000));
			} else {
				throw new Error(`Failed to spawn process after ${maxRetries} attempts`);
			}
		}
	}

	let fetchedCollectionId: string;
	retryCount = 0;
	while (!fetchedCollectionId) {
		await new Promise((r) => setTimeout(r, 2000));
		const gqlResponse = await getGQLData({
			gateway: GATEWAYS.goldsky,
			ids: [processId],
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: null,
		});

		if (gqlResponse && gqlResponse.data.length) {
			console.log(`Fetched transaction`, gqlResponse.data[0].node.id, 0);
			fetchedCollectionId = gqlResponse.data[0].node.id;
		} else {
			console.log(`Transaction not found`, processId, 0);
			retryCount++;
			if (retryCount >= 10) {
				throw new Error(`Transaction not found after 10 attempts, process deployment retries failed`);
			}
		}
	}

	if (fetchedCollectionId) {
		const evalMessage = await aos.message({
			process: processId,
			signer: createDataItemSigner(globalThis.arweaveWallet),
			tags: [{ name: 'Action', value: 'Eval' }],
			data: processSrc,
		});

		const evalResult = await aos.result({
			message: evalMessage,
			process: processId,
		});

		if (!evalResult) {
			throw new Error('Failed to eval new collection');
		}

		const registryTags = [
			{ name: 'Action', value: 'Add-Collection' },
			{ name: 'CollectionId', value: processId },
			{ name: 'Name', value: collection.title },
			{ name: 'Creator', value: profileId },
			{ name: 'DateCreated', value: dateTime },
		];

		if (bannerTx) registryTags.push({ name: 'Banner', value: bannerTx });
		if (thumbnailTx) registryTags.push({ name: 'Thumbnail', value: thumbnailTx });

		await aos.message({
			process: AO.collectionsRegistry,
			signer: createDataItemSigner(globalThis.arweaveWallet),
			tags: registryTags,
		});

		await aos.message({
			process: processId,
			signer: createDataItemSigner(globalThis.arweaveWallet),
			tags: [
				{ name: 'Action', value: 'Add-Collection-To-Profile' },
				{ name: 'ProfileProcess', value: profileId },
			],
		});

		return processId;
	} else {
		throw new Error('Error fetching from gateway');
	}
}

async function messageResults(args: {
	processId: string;
	wallet: any;
	action: string;
	tags: TagType[] | null;
	data: any;
	responses?: string[];
	handler?: string;
}): Promise<any> {
	const tags = [{ name: 'Action', value: args.action }];
	if (args.tags) tags.push(...args.tags);

	await message({
		process: args.processId,
		signer: createDataItemSigner(window.arweaveWallet),
		tags: tags,
		data: JSON.stringify(args.data),
	});

	const messageResults = await results({
		process: args.processId,
		sort: 'DESC',
		limit: 100,
	});

	if (messageResults && messageResults.edges && messageResults.edges.length) {
		const response = {};

		for (const result of messageResults.edges) {
			if (result && result.node && result.node.Messages && result.node.Messages.length) {
				const resultSet = [args.action];
				if (args.responses) resultSet.push(...args.responses);

				for (const message of result.node.Messages) {
					const action = getTagValue(message.Tags, 'Action');

					if (action) {
						let responseData = null;
						const messageData = message.Data;

						if (messageData) {
							try {
								responseData = JSON.parse(messageData);
							} catch {
								responseData = messageData;
							}
						}

						const responseStatus = getTagValue(message.Tags, 'Status');
						const responseMessage = getTagValue(message.Tags, 'Message');

						if (action === 'Action-Response') {
							const responseHandler = getTagValue(message.Tags, 'Handler');
							if (args.handler && args.handler === responseHandler) {
								response[action] = {
									status: responseStatus,
									message: responseMessage,
									data: responseData,
								};
							}
						} else {
							if (resultSet.includes(action)) {
								response[action] = {
									status: responseStatus,
									message: responseMessage,
									data: responseData,
								};
							}
						}

						if (Object.keys(response).length === resultSet.length) break;
					}
				}
			}
		}

		return response;
	}

	return null;
}

export async function uploadCollectionToAO(
	collection: CollectionType,
	assets: AssetType[],
	progressCallback: (progressPercent: number) => void
) {
	const totalCount = assets.length + 2; // Include the collection in the total count
	progressCallback(0.0);

	let profile = await getProfileByWalletAddress({ address: collection.creator.walletAddress });

	if (!profile || !profile.id) throw new Error('Could not find profile');

	let collectionId = await uploadCollection(collection, profile.id);
	progressCallback(parseFloat(((1 / totalCount) * 100).toFixed(2)));

	let assetIds = [];
	for (let i = 0; i < assets.length; i++) {
		assetIds.push(await uploadToAO(assets[i], collectionId, collection.name));
		const percentageProgress = parseFloat((((i + 3) / totalCount) * 100).toFixed(2));
		progressCallback(percentageProgress);
	}

	await messageResults({
		processId: profile.id,
		action: 'Run-Action',
		wallet: await window.arweaveWallet.getActiveAddress(),
		tags: null,
		data: {
			Target: collectionId,
			Action: 'Update-Assets',
			Input: JSON.stringify({
				AssetIds: assetIds,
				UpdateType: 'Add',
			}),
		},
		handler: 'Update-Assets',
	});

	progressCallback(100.0);
}
