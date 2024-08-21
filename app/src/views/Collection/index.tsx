import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionCard } from 'components/organisms/CollectionCard';
import { getCollection, getGQLData } from 'gql';
import { GATEWAYS } from 'helpers/config';
import { language } from 'helpers/language';
import { getProfileByWalletAddress, readHandler, uploadCollectionToAO } from 'helpers/migration';
import { REDUX_TABLES } from 'helpers/redux';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';

export default function Collection() {
	const { id } = useParams();

	const arProvider = useArweaveProvider();

	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [collection, setCollection] = React.useState<CollectionType | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [showMigration, setShowMigration] = React.useState(false);
	const [migrationRunning, setMigrationRunning] = React.useState(false);
	const [disableMigrate, setDisableMigrate] = React.useState(true);
	const [showMigratedModal, setShowMigratedModal] = React.useState<boolean>(false);
	const [migrationMessage, setMigrationMessage] = React.useState<string>('');
	const [buttonMessage, setButtonMessage] = React.useState<string>('Migrate to AO');

	React.useEffect(() => {
		(async function () {
			if (id) {
				setAssets(null);
				setCollection(null);
				setLoading(true);

				const collectionFetch = await getCollection({
					collectionId: id,
					filterListings: false,
					activeSort: 'low-to-high',
				});
				setCollection(collectionFetch);
				setLoading(false);
			}
		})();
	}, [id]);

	React.useEffect(() => {
		if (assetsReducer.collectionData) {
			setAssets(assetsReducer.collectionData);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [assetsReducer.collectionData]);

	React.useEffect(() => {
		(async function () {
			if (assetsReducer.collectionData) {
				if (collection && collection.creator && collection.creator.walletAddress) {
					if (collection.creator.walletAddress === arProvider.walletAddress) {
						setShowMigration(true);
						setButtonMessage(language.checkingMigration);
						console.log('Checking profile for migration...');
						let profile = await getProfileByWalletAddress({ address: collection.creator.walletAddress });
						if (profile && profile.id) {
							setButtonMessage(language.migrate);
							console.log('Profile found');
							setButtonMessage(language.checkingMigration);
							let fetchedCollections = await getGQLData({
								gateway: GATEWAYS.goldsky,
								ids: null,
								tagFilters: [{ name: 'Migrated-From', values: [collection.id] }],
								owners: null,
								cursor: null,
								reduxCursor: null,
								cursorObjectKey: null,
							});
							if (fetchedCollections.data.length > 0) {
								console.log('Collection migration found');
								let processId = fetchedCollections.data[0].node.id;
								const collectionFetch = await readHandler({
									processId: processId,
									action: 'Info',
								});

								if (collectionFetch) {
									if (collectionFetch.Assets && collectionFetch.Assets.length === (collection as any).assets.length) {
										console.log('All assets migrated');
										setButtonMessage(language.migrationComplete);
										setDisableMigrate(true);
									} else {
										console.log('Some assets not yet migrated');
										setDisableMigrate(false);
									}
								} else {
									console.log('No collection found');
								}
							} else {
								console.log('No collection migration found');
								setDisableMigrate(false);
								setButtonMessage(language.migrate);
							}
						} else {
							console.log('No profile found');
						}
					}
				}
			}
		})();
	}, [assetsReducer.collectionData, arProvider.walletAddress]);

	const handleMigrate = async () => {
		setMigrationRunning(true);
		setDisableMigrate(true);
		setButtonMessage(language.migrating);
		try {
			setShowMigratedModal(true);
			await uploadCollectionToAO(collection, assets, (progressPercent: number) => {
				setMigrationMessage(`${progressPercent}% Complete`);
			});
			setMigrationMessage('Collection migrated successfully!');
			setButtonMessage(language.migrationComplete);
		} catch (e: any) {
			setShowMigratedModal(true);
			setDisableMigrate(false);
			setMigrationMessage(`Error migrating collection: ${e.message}`);
			setButtonMessage(language.migrate);
		}
		setMigrationRunning(false);
	};

	return (
		<>
			{showMigratedModal && (
				<Modal header={'BazAR Update'} handleClose={() => setShowMigratedModal(false)}>
					<div className={'modal-info'}>
						<p>Migration Status:</p>
						<br></br>
						<p>{migrationMessage}</p>
					</div>
				</Modal>
			)}
			<div className={'background-wrapper'}>
				<div className={'view-wrapper max-cutoff'}>
					<CollectionCard
						collection={collection}
						hideRedirect
						getStampCount
						showMigration={showMigration}
						disableMigrate={disableMigrate}
						migrationRunning={migrationRunning}
						handleMigrate={() => handleMigrate()}
						buttonMessage={buttonMessage}
					/>
				</div>
				<AssetsTable
					collectionId={id}
					assets={assets}
					apiFetch={'collection'}
					reduxCursor={REDUX_TABLES.collectionAssets}
					recordsPerPage={PAGINATOR}
					showPageNumbers={false}
					tableType={'grid'}
					showNoResults={true}
					loading={loading}
					getFeaturedData={false}
					showFilters={true}
					autoLoadRenderers
				/>
			</div>
		</>
	);
}
