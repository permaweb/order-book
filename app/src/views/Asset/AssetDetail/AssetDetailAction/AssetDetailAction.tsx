import React from 'react';
import { Link } from 'react-router-dom';

import { Modal } from 'components/molecules/Modal';
import { OwnerInfo } from 'global/OwnerInfo';
import { StampWidget } from 'global/StampWidget';
import { REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatPrice, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../styles';
import { IAMProps } from '../types';

import { AssetDetailActionTabs } from './AssetDetailActionTabs';

export default function AssetDetailAction(props: IAMProps) {
	const orProvider = useOrderBookProvider();

	const [currentOwners, setCurrentOwners] = React.useState<OwnerType[] | null>(null);
	const [currentSaleOwners, setCurrentSaleOwners] = React.useState<OwnerListingType[] | null>(null);

	const [showCurrentOwnersModal, setShowCurrentOwnersModal] = React.useState<boolean>(false);
	const [showCurrentSalesModal, setShowCurrentSalesModal] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (props.asset && props.asset.state && orProvider) {
				setCurrentOwners((await getOwners(props.asset.state.balances, orProvider, props.asset)) as any);
				if (props.asset.orders) {
					setCurrentSaleOwners((await getOwners(props.asset.orders, orProvider, props.asset)) as any);
				}
			}
		})();
	}, [props.asset]);

	return props.asset ? (
		<>
			<S.C2>
				<div className={'border-wrapper-alt'}>
					<S.ACHeader>
						<h2>{props.asset.data.title}</h2>
						<S.ACLink>
							<Link target={'_blank'} to={REDIRECTS.viewblock(props.asset.data.id)}>
								{language.viewblock}
							</Link>
						</S.ACLink>
						<S.StampWidget>
							<StampWidget assetId={props.asset.data.id} title={props.asset.data.title} stamps={null} getCount />
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
					</S.ACHeader>
				</div>
				<AssetDetailActionTabs asset={props.asset} updateAsset={props.updateAsset} />
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
									<OwnerInfo owner={owner} asset={props.asset} isSaleOrder={false} updateAsset={props.updateAsset} />
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
									<OwnerInfo owner={owner} asset={props.asset} isSaleOrder={true} updateAsset={props.updateAsset} />
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
