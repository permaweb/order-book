import React from 'react';
import { Link } from 'react-router-dom';

import { AssetDetailType, CollectionAssetType, TAGS } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { TxAddress } from 'components/atoms/TxAddress';
import { AssetData } from 'components/organisms/AssetData';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { ASSETS, STORAGE } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import * as urls from 'helpers/urls';
import { formatCount, formatDate, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../styles';
import { IAProps } from '../types';

import { AssetDetailLicenses } from './AssetDetailLicenses';

export default function AssetDetailInfo(props: IAProps) {
	const orProvider = useOrderBookProvider();

	const [creator, setCreator] = React.useState<OwnerType | OwnerListingType | null>(null);
	const [sponsored, setSponsored] = React.useState<boolean>(false);

	const [collection, setCollection] = React.useState<CollectionAssetType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.asset && orProvider.orderBook) {
				const creator = (
					await getOwners([{ creator: props.asset.data.creator }], orProvider, props.asset as AssetDetailType)
				)[0];
				setCreator(creator);
			}
		})();
	}, [props.asset, orProvider.orderBook]);

	React.useEffect(() => {
		(async function () {
			if (props.asset && props.asset.data.collectionCode && orProvider.orderBook) {
				const collection = await orProvider.orderBook.api.getCollectionByCode({
					collectionCode: props.asset.data.collectionCode,
				});
				setCollection(collection);
			}
		})();
	}, [props.asset, orProvider.orderBook]);

	React.useEffect(() => {
		(async function () {
			if (
				props.asset &&
				props.asset.data.holderTitle &&
				props.asset.data.holderTitle === TAGS.values.holderTitle.sponsor
			) {
				setSponsored(true);
			}
		})();
	}, [props.asset]);

	return props.asset ? (
		<S.C1Wrapper>
			<S.C1>
				<S.AssetWrapper>
					<AssetData asset={props.asset} frameMinHeight={550} autoLoad />
				</S.AssetWrapper>
			</S.C1>
			<S.AssetInfoWrapper>
				<S.DrawerWrapper>
					<Drawer
						title={language.overview}
						icon={ASSETS.overview}
						content={
							<S.DrawerContent>
								<S.DCHeader>{props.asset.data.title}</S.DCHeader>
								{creator && !sponsored && (
									<S.DCOwnerFlex>
										<p>{language.createdBy}</p>
										<OwnerInfo
											owner={creator}
											asset={props.asset}
											isSaleOrder={false}
											handleUpdate={() => {}}
											loading={false}
											hideOrderCancel={false}
										/>
									</S.DCOwnerFlex>
								)}
								{sponsored && (
									<S.DCOwnerFlex>
										<p>{language.sponsoredAsset}</p>
									</S.DCOwnerFlex>
								)}
								{collection && (
									<S.DCCollectionFlex>
										<Link to={`${urls.collection}${collection.id}`}>{collection.title}</Link>
									</S.DCCollectionFlex>
								)}
								<S.DCLineNoMax>{props.asset.data.description}</S.DCLineNoMax>
							</S.DrawerContent>
						}
					/>
				</S.DrawerWrapper>
				<S.DrawerWrapper>
					<AssetDetailLicenses asset={props.asset} />
				</S.DrawerWrapper>
				<S.DrawerWrapper>
					<Drawer
						title={language.provenanceDetails}
						icon={ASSETS.provenance}
						content={
							<S.DrawerContent>
								<S.DCLine>
									<S.DCLineHeader>
										<p>{language.transactionId}</p>
									</S.DCLineHeader>
									<TxAddress address={props.asset.data.id} wrap={false} />
								</S.DCLine>
								{props.asset.data.blockHeight !== 0 && (
									<S.DCLine>
										<S.DCLineHeader>
											<p>{language.blockHeight}</p>
										</S.DCLineHeader>
										<S.DCLineDetail>{formatCount(props.asset.data.blockHeight.toString())}</S.DCLineDetail>
									</S.DCLine>
								)}
								{props.asset.data.dateCreated !== 0 && (
									<S.DCLine>
										<S.DCLineHeader>
											<p>{language.dateCreated}</p>
										</S.DCLineHeader>
										<S.DCLineDetail>{formatDate(props.asset.data.dateCreated, 'iso')}</S.DCLineDetail>
									</S.DCLine>
								)}
								{props.asset.data.implementation && props.asset.data.implementation !== STORAGE.none && (
									<S.DCLine>
										<S.DCLineHeader>
											<p>{language.standard}</p>
										</S.DCLineHeader>
										<S.DCLineDetail>{props.asset.data.implementation}</S.DCLineDetail>
									</S.DCLine>
								)}
							</S.DrawerContent>
						}
					/>
				</S.DrawerWrapper>
			</S.AssetInfoWrapper>
		</S.C1Wrapper>
	) : null;
}
