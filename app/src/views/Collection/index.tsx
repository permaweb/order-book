import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createDataItemSigner, message, result } from '@permaweb/aoconnect/browser';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { Modal } from 'components/molecules/Modal';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionCard } from 'components/organisms/CollectionCard';
import { getCollection, getGQLData } from 'gql';
import { GATEWAYS } from 'helpers/config';
import { language } from 'helpers/language';
import { getProfileByWalletAddress, uploadCollectionToAO } from 'helpers/migration';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';

export default function Collection() {
	const { id } = useParams();

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
        if(collection && collection.creator && collection.creator.walletAddress) {
          if(collection.creator.walletAddress === await window.arweaveWallet.getActiveAddress()) {
            let profile = await getProfileByWalletAddress({ address: collection.creator.walletAddress });
            if(profile && profile.id) {
              setShowMigration(true);
              setButtonMessage(language.checkingMigration)
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
                let found = false;
                for (let i = 0; i < fetchedCollections.data.length; i++) {
                  let processId = fetchedCollections.data[i].node.id;
                  const evalMessage = await message({
                    process: processId,
                    signer: createDataItemSigner(globalThis.arweaveWallet),
                    tags: [{ name: 'Action', value: 'Eval' }],
                    data: 'return Handlers.list',
                  });
                  const { Output } = await result({ message: evalMessage, process: processId });
                  if (Output && Output.data && Output.data.output && Output.data.output.includes('Update-Assets')) {
                    const evalMessageAssets = await message({
                      process: processId,
                      signer: createDataItemSigner(globalThis.arweaveWallet),
                      tags: [{ name: 'Action', value: 'Eval' }],
                      data: 'return Assets',
                    });
                    const { Output: OutputAssets } = await result({ message: evalMessageAssets, process: processId });
                    let s = OutputAssets.data.output.toString();
                    const cleanedStr = s.replace(/[{}]/g, '').trim();
                    const foundIds = cleanedStr.split(',').map((id: any) => id.trim().replace(/^"|"$/g, ''));
                    // the assets made it into the collection
                    if(foundIds.length == assetsReducer.collectionData.length) {
                      const evalMessageAssetsProfile = await message({
                        process: profile.id,
                        signer: createDataItemSigner(globalThis.arweaveWallet),
                        tags: [{ name: 'Action', value: 'Eval' }],
                        data: 'return Assets',
                      });
                      const { Output: OutputAssetsProfile } = await result({ message: evalMessageAssetsProfile, process: profile.id });
                      let foundInProfile = 0;
                      for(let i=0; i<foundIds.length; i++) {
                        // the asset made it to the profile
                        if(OutputAssetsProfile.data.output.toString().includes(foundIds[i])) {
                          foundInProfile += 1;
                        }
                      }
                      if(foundIds.length == foundInProfile) found = true;
                    }
                  }
                }
                if (!found) {
									setDisableMigrate(false);
									setButtonMessage(language.migrate);
								} else {
									setButtonMessage(language.migrationComplete);
								}
              } else {
                setDisableMigrate(false);
                setButtonMessage(language.migrate);
              }
            }
          }
        }
      } 
    })();
	}, [assetsReducer.collectionData]);

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
