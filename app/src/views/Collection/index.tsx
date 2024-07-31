import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetType, CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionCard } from 'components/organisms/CollectionCard';
import { Modal } from 'components/molecules/Modal';
import { getCollection, getGQLData } from 'gql';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';
import { uploadCollectionToAO, getProfileByWalletAddress } from 'helpers/migration';
import { GATEWAYS } from 'helpers/config';
import { createDataItemSigner, message, result } from '@permaweb/aoconnect/browser';
import { language } from 'helpers/language';

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
                    found = true;
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
		try {
      setShowMigratedModal(true);
			await uploadCollectionToAO(
        collection, 
        assets,
        (progressPercent: number) => { 
          setMigrationMessage(`${progressPercent}% Complete`) 
        }
      );
			setMigrationMessage('Collection migrated successfully!');
		} catch (e: any) {
			setShowMigratedModal(true);
      setDisableMigrate(false);
			setMigrationMessage(`Error migrating collection: ${e.message}`);
		}
		setMigrationRunning(false);
  }

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
