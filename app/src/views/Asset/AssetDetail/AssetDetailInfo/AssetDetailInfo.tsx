import React from 'react';

import { AssetDetailType } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { TxAddress } from 'components/atoms/TxAddress';
import { AssetData } from 'global/AssetData';
import { OwnerInfo } from 'global/OwnerInfo';
import { ASSETS, STORAGE } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatCount, formatDate, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../styles';
import { IAProps } from '../types';

import { AssetDetailLicenses } from './AssetDetailLicenses';

export default function AssetDetailInfo(props: IAProps) {
	const orProvider = useOrderBookProvider();

	const [creator, setCreator] = React.useState<OwnerType | OwnerListingType | null>(null);

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
								{creator && (
									<S.DCOwnerFlex>
										<p>{language.createdBy}</p>
										<OwnerInfo
											owner={creator}
											asset={props.asset}
											isSaleOrder={false}
											handleUpdate={() => {}}
											loading={false}
										/>
									</S.DCOwnerFlex>
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
								<S.DCLine>
									<S.DCLineHeader>
										<p>{language.blockHeight}</p>
									</S.DCLineHeader>
									<S.DCLineDetailMedium>{formatCount(props.asset.data.blockHeight.toString())}</S.DCLineDetailMedium>
								</S.DCLine>
								<S.DCLine>
									<S.DCLineHeader>
										<p>{language.dateCreated}</p>
									</S.DCLineHeader>
									<S.DCLineDetailMedium>{formatDate(props.asset.data.dateCreated * 1000, 'iso')}</S.DCLineDetailMedium>
								</S.DCLine>
								{props.asset.data.implementation && props.asset.data.implementation !== STORAGE.none && (
									<S.DCLine>
										<S.DCLineHeader>
											<p>{language.standard}</p>
										</S.DCLineHeader>
										<S.DCLineDetailMedium>{props.asset.data.implementation}</S.DCLineDetailMedium>
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
