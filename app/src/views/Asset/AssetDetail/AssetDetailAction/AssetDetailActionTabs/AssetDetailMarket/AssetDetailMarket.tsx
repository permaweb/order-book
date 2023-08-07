import React from 'react';

import { AssetDetailType } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatPrice, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../../../styles';
import { IAMProps } from '../../../types';

import { AssetDetailMarketAction } from './AssetDetailMarketAction';
import { AssetDetailMarketChart } from './AssetDetailMarketChart';

export default function AssetDetailMarket(props: IAMProps) {
	const orProvider = useOrderBookProvider();

	const [currentOwners, setCurrentOwners] = React.useState<OwnerType[] | null>(null);
	const [currentSaleOwners, setCurrentSaleOwners] = React.useState<OwnerListingType[] | null>(null);

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

	function getChart() {
		if (currentOwners && currentOwners.length > 1) {
			return <AssetDetailMarketChart asset={props.asset} owners={currentOwners} />;
		} else {
			return null;
		}
	}

	return asset ? (
		<>
			{getChart()}
			<S.AssetCAction className={'border-wrapper-alt'}>
				<AssetDetailMarketAction
					asset={asset as AssetDetailType}
					handleUpdate={props.handleUpdate as () => Promise<void>}
				/>
			</S.AssetCAction>
			{currentSaleOwners && currentSaleOwners.length > 0 && (
				<S.DrawerWrapper>
					<Drawer
						title={language.activeSaleOrders}
						icon={ASSETS.orders}
						content={
							<S.DrawerContent>
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
												handleUpdate={props.handleUpdate}
												loading={false}
											/>
											<S.DCLineFlex>
												<S.DCSalePercentage>{`${(owner.sellPercentage * 100).toFixed(2)}%`}</S.DCSalePercentage>
												<S.DCLineDetail>{`${formatPrice(owner.sellUnitPrice)} U`}</S.DCLineDetail>
											</S.DCLineFlex>
										</S.DCLine>
									);
								})}
							</S.DrawerContent>
						}
					/>
				</S.DrawerWrapper>
			)}
			{/* {currentOwners && currentOwners.length > 0 && (
				<S.DrawerWrapper>
					<Drawer
						title={language.currentAssetOwners}
						icon={ASSETS.owners}
						content={
							<S.DrawerContent>
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
												handleUpdate={props.handleUpdate}
												loading={false}
											/>
											<S.DCLineDetail>{`${(owner.ownerPercentage * 100).toFixed(2)}%`}</S.DCLineDetail>
										</S.DCLine>
									);
								})}
							</S.DrawerContent>
						}
					/>
				</S.DrawerWrapper>
			)} */}
		</>
	) : null;
}
