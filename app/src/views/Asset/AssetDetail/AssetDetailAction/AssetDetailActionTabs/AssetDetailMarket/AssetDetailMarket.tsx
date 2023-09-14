import React from 'react';

import { AssetDetailType, ORDERBOOK_CONTRACT, STAMP_CONTRACT } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatCount, formatPrice, getOwners } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from '../../../styles';
import { IADProps } from '../../../types';

import { AssetDetailMarketAction } from './AssetDetailMarketAction';
import { AssetDetailMarketChart } from './AssetDetailMarketChart';

export default function AssetDetailMarket(props: IADProps) {
	const orProvider = useOrderBookProvider();

	const [currentOwners, setCurrentOwners] = React.useState<OwnerType[] | null>(null);
	const [currentSaleOwners, setCurrentSaleOwners] = React.useState<OwnerListingType[] | null>(null);

	const [denominator, setDenominator] = React.useState<number | null>(null);

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);

	React.useEffect(() => {
		if (props.asset) setAsset(props.asset as AssetDetailType);
	}, [props.asset]);

	React.useEffect(() => {
		(async function () {
			if (asset && asset.state && orProvider) {
				setCurrentOwners((await getOwners(asset.state.balances, orProvider, asset)) as any);
				if (asset.orders) {
					const owners = ((await getOwners(asset.orders, orProvider, asset)) as any).filter(
						(owner: OwnerListingType) => owner.address !== ORDERBOOK_CONTRACT
					);
					setCurrentSaleOwners(owners);
				}

				if (!denominator && asset.state.divisibility) {
					setDenominator(Math.pow(10, asset.state.divisibility));
				}
				if (!denominator && props.asset.data.id === STAMP_CONTRACT) {
					setDenominator(Math.pow(10, 12));
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

	function getActiveSaleOrderPrice(owner: any) {
		if (props.asset.data.id === STAMP_CONTRACT) return `${owner.sellUnitPrice} U`;
		return `${formatCount(
			formatPrice(denominator ? owner.sellUnitPrice * denominator : owner.sellUnitPrice).toString()
		)} U`;
	}

	return asset ? (
		<>
			{getChart()}
			<S.AssetCAction className={'border-wrapper-alt'}>
				<AssetDetailMarketAction
					asset={asset as AssetDetailType}
					handleUpdate={props.handleUpdate as () => Promise<void>}
					pendingResponse={props.pendingResponse}
					updating={props.updating}
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
												hideOrderCancel={props.updating || props.pendingResponse !== null}
											/>
											<S.DCLineFlex>
												<S.DCSalePercentage>{`${(owner.sellPercentage * 100).toFixed(2)}%`}</S.DCSalePercentage>
												<S.DCLineDetail>{getActiveSaleOrderPrice(owner)}</S.DCLineDetail>
											</S.DCLineFlex>
										</S.DCLine>
									);
								})}
							</S.DrawerContent>
						}
					/>
				</S.DrawerWrapper>
			)}
		</>
	) : null;
}
