import React from 'react';
import { Link } from 'react-router-dom';

import { AssetDetailType } from 'permaweb-orderbook';

import { TxAddress } from 'components/atoms/TxAddress';
import { Modal } from 'components/molecules/Modal';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { StampWidget } from 'components/organisms/StampWidget';
import { REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatPrice, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../styles';
import { IADProps } from '../types';

import { AssetDetailActionTabs } from './AssetDetailActionTabs';

export default function AssetDetailAction(props: IADProps) {
	const orProvider = useOrderBookProvider();

	const [currentOwners, setCurrentOwners] = React.useState<OwnerType[] | null>(null);
	const [currentSaleOwners, setCurrentSaleOwners] = React.useState<OwnerListingType[] | null>(null);

	const [showCurrentOwnersModal, setShowCurrentOwnersModal] = React.useState<boolean>(false);
	const [showCurrentSalesModal, setShowCurrentSalesModal] = React.useState<boolean>(false);

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);

	React.useEffect(() => {
		if (props.asset) setAsset(props.asset as AssetDetailType);
	}, [props.asset]);

	React.useEffect(() => {
		(async function () {
			if (asset && asset.state && orProvider) {
				setCurrentOwners((await getOwners(asset.state.balances, orProvider, asset)) as any);
				if (asset.orders) {
					setCurrentSaleOwners((await getOwners(asset.orders, orProvider, asset)) as any);
				}
			}
		})();
	}, [asset]);

	return asset ? (
		<>
			<S.C2>
				<div className={'border-wrapper-alt'}>
					<S.ACHeader>
						<h2>{asset.data.title}</h2>
						<S.ACLink>
							<Link target={'_blank'} to={REDIRECTS.viewblock(asset.data.id)}>
								{language.viewblock}
							</Link>
						</S.ACLink>
						<S.StampWidget>
							<StampWidget assetId={asset.data.id} title={asset.data.title} stamps={null} getCount />
						</S.StampWidget>
						{currentOwners && currentOwners.length > 0 && (
							<S.OwnerLine>
								<span>{language.currentlyOwnedBy}</span>
								<button
									onClick={() => {
										setShowCurrentOwnersModal(true);
									}}
								>{`${currentOwners.length} ${currentOwners.length > 1 ? language.owners : language.owner}`}</button>
							</S.OwnerLine>
						)}
						{currentSaleOwners && currentSaleOwners.length > 0 && (
							<S.OwnerLineAlt>
								<span>{language.currentlyBeingSoldBy}</span>
								<button
									onClick={() => {
										setShowCurrentSalesModal(true);
									}}
								>{`${currentSaleOwners.length} ${
									currentSaleOwners.length > 1 ? language.owners : language.owner
								}`}</button>
							</S.OwnerLineAlt>
						)}
						{props.pendingResponse && (
							<S.PendingLine>
								<span>{`${language.orderPending}...`}</span>
								<TxAddress address={props.pendingResponse.tx} wrap={true} />
							</S.PendingLine>
						)}
						{props.updating && (
							<S.UpdatingLine>
								<span>{`${language.updatingAsset}...`}</span>
							</S.UpdatingLine>
						)}
					</S.ACHeader>
				</div>
				<AssetDetailActionTabs
					asset={asset}
					handleUpdate={props.handleUpdate}
					pendingResponse={props.pendingResponse}
					updating={props.updating}
				/>
			</S.C2>

			{showCurrentOwnersModal && currentOwners && (
				<Modal header={language.currentAssetOwners} handleClose={() => setShowCurrentOwnersModal(false)}>
					<S.DrawerContent transparent>
						<S.DrawerHeader>
							<p>{language.owner.charAt(0).toUpperCase() + language.owner.slice(1)}</p>
							<p>{language.percentage}</p>
						</S.DrawerHeader>
						{currentOwners.map((owner: OwnerType, index: number) => {
							return (
								<S.DCLine key={index}>
									<OwnerInfo
										owner={owner}
										asset={asset}
										isSaleOrder={false}
										handleUpdate={(orderResponse: any) => {
											setShowCurrentOwnersModal(false);
											props.handleUpdate(orderResponse);
										}}
										loading={false}
										hideOrderCancel={props.updating || props.pendingResponse}
									/>
									<S.DCLineDetail>{`${(owner.ownerPercentage * 100).toFixed(2)}%`}</S.DCLineDetail>
								</S.DCLine>
							);
						})}
					</S.DrawerContent>
				</Modal>
			)}
			{showCurrentSalesModal && currentSaleOwners && (
				<Modal header={language.activeSaleOrders} handleClose={() => setShowCurrentSalesModal(false)}>
					<S.DrawerContent transparent>
						<S.DrawerHeader>
							<p>{language.seller}</p>
							<S.DrawerHeaderFlex>
								<p>{language.percentage}</p>
								<p>{language.listPrice}</p>
							</S.DrawerHeaderFlex>
						</S.DrawerHeader>
						{currentSaleOwners.map((owner: OwnerListingType, index: number) => {
							return (
								<S.DCLine key={index}>
									<OwnerInfo
										owner={owner}
										asset={asset}
										isSaleOrder={true}
										handleUpdate={(orderResponse: any) => {
											setShowCurrentSalesModal(false);
											props.handleUpdate(orderResponse);
										}}
										loading={false}
										hideOrderCancel={props.updating || props.pendingResponse}
									/>
									<S.DCLineFlex>
										<S.DCSalePercentage>{`${(owner.sellPercentage * 100).toFixed(2)}%`}</S.DCSalePercentage>
										<S.DCLineDetail>{`${formatPrice(owner.sellUnitPrice)} U`}</S.DCLineDetail>
									</S.DCLineFlex>
								</S.DCLine>
							);
						})}
					</S.DrawerContent>
				</Modal>
			)}
		</>
	) : null;
}
