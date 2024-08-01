import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

import { AssetType, getTxEndpoint, ORDERBOOK_CONTRACT, STORAGE, TagType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { AssetData } from 'components/organisms/AssetData';
import { AssetOrders } from 'components/organisms/AssetOrders';
import { StampWidget } from 'components/organisms/StampWidget';
import { getGQLData } from 'gql';
import { ASSETS, GATEWAYS } from 'helpers/config';
import { getRendererEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { uploadToAO } from 'helpers/migration';
import { AssetRenderType, ContentType } from 'helpers/types';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetTile(props: { asset: AssetType; index: number; autoLoad: boolean; showMigration: boolean }) {
	const navigate = useNavigate();
	const redirect = `${urls.asset}${props.asset.data.id}`;

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);
	const [loadRenderer, setLoadRenderer] = React.useState<boolean>(false);

	const [migrationRunning, setMigrationRunning] = React.useState(false);
	const [disableMigrate, setDisableMigrate] = React.useState(true);

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
		setDisableMigrate(true);
	};

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				if (props.asset.data.creator === (await window.arweaveWallet.getActiveAddress())) {
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
						let found = false;
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
								found = true;
							}
						}
						if (!found) {
							setDisableMigrate(false);
						}
					} else {
						setDisableMigrate(false);
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
									disabled={disableMigrate ? true : migrationRunning}
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
