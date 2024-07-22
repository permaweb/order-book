import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, createDataItemSigner, dryrun, message, result } from '@permaweb/aoconnect';

import { AssetType, getTxEndpoint, ORDERBOOK_CONTRACT, STORAGE, TagType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { AssetData } from 'components/organisms/AssetData';
import { AssetOrders } from 'components/organisms/AssetOrders';
import { StampWidget } from 'components/organisms/StampWidget';
import { getGQLData } from 'gql';
import { getAssetById } from 'gql/assets';
import { ASSETS, GATEWAYS } from 'helpers/config';
import { getRendererEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { AssetRenderType, ContentType } from 'helpers/types';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

export const AO = {
	module: 'Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350',
	scheduler: '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA',
	assetSrc: 'Fmtgzy1Chs-5ZuUwHpQjQrQ7H7v1fjsP0Bi8jVaDIKA',
	defaultToken: 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10',
	ucm: 'U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0',
	pixl: 'DM3FoZUq_yebASPhgd8pEIRIzDW6muXEhxz5-JwbZwo',
	collectionsRegistry: 'TFWDmf8a3_nw43GCm_CuYlYoylHAjCcFGbgHfDaGcsg',
	collectionSrc: '2ZDuM2VUCN8WHoAKOOjiH4_7Apq0ZHKnTWdLppxCdGY',
	profileRegistry: 'SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY',
	profileSrc: 'pbrl1fkS3_SZP3RqqPIjbt3-f81L9vIpV2_OnUmxqGQ',
};

function convertToLuaTable(obj) {
	const entries = Object.entries(obj).map(([key, value]) => `['${key}'] = ${value}`);
	return `{ ${entries.join(', ')} }`;
}

export type AOProfileType = {
	id: string;
	walletAddress: string;
	displayName: string | null;
	username: string | null;
	bio: string | null;
	avatar: string | null;
	banner: string | null;
};

export type ProfileHeaderType = AOProfileType;

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

async function uploadToAO(asset: AssetType) {
	let fetchedAsset = await getGQLData({
		gateway: GATEWAYS.arweave,
		ids: [asset.data.id],
		tagFilters: null,
		owners: null,
		cursor: null,
		reduxCursor: null,
		cursorObjectKey: null,
	});

	let tags: TagType[] = fetchedAsset.data[0].node.tags
		.filter((tag) => {
			return (
				tag.name !== 'App-Name' &&
				tag.name !== 'App-Version' &&
				tag.name !== 'Contract-Src' &&
				tag.name !== 'Contract-Manifest' &&
				tag.name !== 'Init-State'
			);
		})
		.map((tag) => {
			return {
				name: tag.name,
				value: tag.value,
			};
		});
	tags.push({ name: 'Migrated-From', value: asset.data.id });

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
		}
	} else {
		throw new Error('Error fetching from gateway');
	}
}

function AssetTile(props: { asset: AssetType; index: number; autoLoad: boolean; showMigration: boolean }) {
	const navigate = useNavigate();
	const redirect = `${urls.asset}${props.asset.data.id}`;

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);
	const [loadRenderer, setLoadRenderer] = React.useState<boolean>(false);

	const [migrationRunning, setMigrationRunning] = React.useState(false);
	const [isMigrated, setIsMigrated] = React.useState(false);

	const [showMigratedModal, setShowMigratedModal] = React.useState<boolean>(false);
	const [migrationMessage, setMigrationMessage] = React.useState<string>('');

	const migrateAsset = async () => {
		setMigrationRunning(true);
		try {
			await uploadToAO(props.asset);
			setShowMigratedModal(true);
			setMigrationMessage('Asset migrated successfully!');
		} catch (e: any) {
			setShowMigratedModal(true);
			setMigrationMessage(`Error migrating asset: ${e.message}`);
		}
		setMigrationRunning(false);
		setIsMigrated(true);
	};

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				let fetchedAssets = await getGQLData({
					gateway: GATEWAYS.goldsky,
					ids: null,
					tagFilters: [{ name: 'Migrated-From', values: [props.asset.data.id] }],
					owners: null,
					cursor: null,
					reduxCursor: null,
					cursorObjectKey: null,
				});
				if (fetchedAssets.data.length > 0) {
					for (let i = 0; i < fetchedAssets.data.length; i++) {
						let processId = fetchedAssets.data[i].node.id;
						const evalMessage = await message({
							process: processId,
							signer: createDataItemSigner(globalThis.arweaveWallet),
							tags: [{ name: 'Action', value: 'Eval' }],
							data: 'return Handlers.list',
						});
						const { Output } = await result({ message: evalMessage, process: processId });
						if (Output && Output.data && Output.data.output && Output.data.output.includes('Balances')) {
							setIsMigrated(true);
						}
					}
				}
			}
		})();
	}, [props.asset]);

	React.useEffect(() => {
		(async function () {
			const renderWith =
				props.asset.data?.renderWith && props.asset.data.renderWith !== STORAGE.none
					? props.asset.data.renderWith
					: '[]';
			let parsedRenderWith: string | null = null;
			try {
				parsedRenderWith = JSON.parse(renderWith);
			} catch (e: any) {
				parsedRenderWith = renderWith;
			}
			if (parsedRenderWith && parsedRenderWith.length) {
				setAssetRender({
					url: getRendererEndpoint(parsedRenderWith, props.asset.data.id),
					type: 'renderer',
					contentType: 'renderer',
				});
			} else {
				const assetResponse = await fetch(getTxEndpoint(props.asset.data.id));
				const contentType = assetResponse.headers.get('content-type');
				if (assetResponse.status === 200 && contentType) {
					setAssetRender({
						url: assetResponse.url,
						type: 'raw',
						contentType: contentType as ContentType,
					});
				}
			}
		})();
	}, [props.asset]);

	return assetRender ? (
		<S.PICWrapper>
			{showMigratedModal && (
				<Modal header={'BazAR Update'} handleClose={() => setShowMigratedModal(false)}>
					<div className={'modal-info'}>
						<p>{migrationMessage}</p>
					</div>
				</Modal>
			)}
			{assetRender && !(assetRender.type === 'renderer') && (
				<S.PCLink>
					<Link to={redirect} />
				</S.PCLink>
			)}
			<S.PCWrapper>
				<AssetData
					asset={props.asset}
					assetRender={assetRender}
					frameMinHeight={350}
					autoLoad={props.autoLoad}
					loadRenderer={loadRenderer}
				/>
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<Link to={redirect}>
							<p>{props.asset.data.title}</p>
						</Link>
					</S.AssetData>
					<IconButton
						type={'alt1'}
						src={ASSETS.details}
						handlePress={() => navigate(redirect)}
						tooltip={language.viewDetails}
						dimensions={{
							wrapper: 37.5,
							icon: 22.5,
						}}
					/>
				</S.ICFlex>
				<S.ICBottom>
					<S.AssetDataAlt>
						<AssetOrders asset={props.asset} />
					</S.AssetDataAlt>
					<S.ICWidgetIcons>
						{assetRender && assetRender.type === 'renderer' && !props.autoLoad && !loadRenderer && (
							<S.Icon>
								<Button
									type={'primary'}
									label={language.load}
									handlePress={() => setLoadRenderer(true)}
									tooltip={language.loadAssetData}
									noMinWidth
									height={37.5}
								/>
							</S.Icon>
						)}
						<StampWidget
							assetId={props.asset.data.id}
							title={props.asset.data.title}
							stamps={props.asset.stamps ? props.asset.stamps : null}
						/>
						{props.showMigration && props.asset.data.id !== ORDERBOOK_CONTRACT && (
							<S.MigrateButton>
								<Button
									type={'primary'}
									label={!migrationRunning ? language.migrate : language.migrating}
									handlePress={() => {
										migrateAsset();
									}}
									tooltip={language.migrate}
									width={100}
									noMinWidth={false}
									height={40}
									disabled={isMigrated ? true : migrationRunning}
								/>
							</S.MigrateButton>
						)}
					</S.ICWidgetIcons>
				</S.ICBottom>
			</S.ICWrapper>
		</S.PICWrapper>
	) : (
		<S.PICWrapper>
			<S.PCLoader>
				<Loader placeholder />
			</S.PCLoader>
			<S.ICLoader>
				<Loader placeholder />
			</S.ICLoader>
		</S.PICWrapper>
	);
}

export default function AssetsGrid(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getData() {
		if (!assets || props.loading) {
			const keys = Array.from({ length: props.loaderCount }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCLoader key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCLoader>
					<S.ICLoader key={`ic_${element}`}>
						<Loader placeholder />
					</S.ICLoader>
				</S.PICWrapper>
			));
			return <>{elements}</>;
		} else {
			if (assets) {
				if (assets.length > 0) {
					return assets.map((asset: AssetType, index: number) => {
						return (
							<AssetTile
								key={asset.data.id}
								asset={asset}
								index={index + 1}
								autoLoad={props.autoLoad}
								showMigration={props.showMigration}
							/>
						);
					});
				} else {
					return (
						<div className={'view-wrapper max-cutoff'}>
							<S.NoAssetsContainer>
								<p>{language.noAssets}</p>
							</S.NoAssetsContainer>
						</div>
					);
				}
			} else {
				return null;
			}
		}
	}

	return (
		<S.Wrapper>
			{props.title && (
				<S.Header>
					<S.Header1>
						<p>{props.title.toUpperCase()}</p>
					</S.Header1>
				</S.Header>
			)}
			{getData()}
		</S.Wrapper>
	);
}
