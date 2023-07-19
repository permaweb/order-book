import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { AssetDetailType, getTxEndpoint, OrderBookPairOrderType, STORAGE } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Drawer } from 'components/atoms/Drawer';
import { Loader } from 'components/atoms/Loader';
import { PieChart } from 'components/atoms/PieChart';
import { TxAddress } from 'components/atoms/TxAddress';
import { Modal } from 'components/molecules/Modal';
import { AssetData } from 'global/AssetData';
import { AssetLicenses } from 'global/AssetLicenses';
import { OrderCancel } from 'global/OrderCancel';
import { StampWidget } from 'global/StampWidget';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatAddress, formatCount, formatDate, formatPrice } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import { AssetDetailAction } from './AssetDetailAction';
import * as S from './styles';
import { IProps } from './types';

function OwnerInfo({ owner, asset, isSaleOrder, updateAsset }) {
	const arProvider = useArweaveProvider();

	const [hasError, setHasError] = React.useState(false);

	const handleError = () => {
		setHasError(true);
	};

	const avatar =
		!hasError && owner.avatar ? (
			<S.Avatar>
				<img src={getTxEndpoint(owner.avatar)} onError={handleError} />
			</S.Avatar>
		) : (
			<S.Avatar>
				<ReactSVG src={ASSETS.user} />
			</S.Avatar>
		);

	function getOwnerOrder() {
		if (!arProvider.walletAddress || !isSaleOrder) return false;
		if (asset && asset.orders && asset.orders.length) {
			for (let i = 0; i < asset.orders.length; i++) {
				if (owner.address === arProvider.walletAddress && asset.orders[i].creator === arProvider.walletAddress) {
					return true;
				}
			}
		}
		return false;
	}

	return (
		<>
			<S.DCLineHeader>
				{avatar}
				{owner.handle ? <S.NoWrap>{owner.handle}</S.NoWrap> : <TxAddress address={owner.address} wrap={false} />}
				{getOwnerOrder() && (
					<>
						&nbsp;
						<OrderCancel asset={asset} updateAsset={updateAsset} />
					</>
				)}
			</S.DCLineHeader>
		</>
	);
}

export default function AssetDetail(props: IProps) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);
	const [errorFetchingAsset, setErrorFetchingAsset] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);

	const [currentOwners, setCurrentOwners] = React.useState<OwnerType[] | null>(null);
	const [currentSaleOwners, setCurrentSaleOwners] = React.useState<OwnerListingType[] | null>(null);

	const [showCurrentOwnersModal, setShowCurrentOwnersModal] = React.useState<boolean>(false);
	const [showCurrentSalesModal, setShowCurrentSalesModal] = React.useState<boolean>(false);

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalSalesBalance, setTotalSalesBalance] = React.useState<number>(0);
	const [updateBalance, _setUpdateBalance] = React.useState<boolean>(false);

	React.useEffect(() => {
		setAsset(null);
	}, [props.assetId]);

	React.useEffect(() => {
		(async function () {
			if (orProvider.orderBook) {
				setLoading(true);
				try {
					setAsset((await orProvider.orderBook.api.getAssetById({ id: props.assetId })) as AssetDetailType);
				} catch (e: any) {
					console.error(e);
					setErrorFetchingAsset(true);
				}
				setLoading(false);
			}
		})();
	}, [orProvider.orderBook, props.assetId]);

	React.useEffect(() => {
		if (asset && asset.state) {
			const balances = Object.keys(asset.state.balances).map((balance: any) => {
				return asset.state.balances[balance];
			});
			setTotalBalance(balances.reduce((a: number, b: number) => a + b, 0));
		}
	}, [asset]);

	React.useEffect(() => {
		if (asset && asset.orders) {
			const saleBalances = asset.orders.map((order: OrderBookPairOrderType) => {
				return order.quantity;
			});
			setTotalSalesBalance(saleBalances.reduce((a: number, b: number) => a + b, 0));
		}
	}, [asset]);

	async function updateAsset() {
		if (orProvider.orderBook) {
			setAsset(null);
			setLoading(true);
			setAsset((await orProvider.orderBook.api.getAssetById({ id: props.assetId })) as AssetDetailType);
			arProvider.setUpdateBalance(!updateBalance);
			setLoading(false);
		}
	}

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
			const quantities: { label: string; value: string; quantity: number }[] = [...currentOwners]
				.filter((owner: any) => {
					return owner.address !== orProvider.orderBook.env.orderBookContract;
				})
				.map((owner: any) => {
					return {
						label: owner.handle
							? `${owner.handle} (${(
									(owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage) * 100
							  ).toFixed(2)}%)`
							: `${formatAddress(owner.address, false)} (${(
									(owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage) * 100
							  ).toFixed(2)}%)`,
						value: currentOwners.map((owner: any) =>
							owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage
						),
						quantity: owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage,
					};
				}) as any;

			if (totalSalesBalance && totalSalesBalance > 0) {
				quantities.push({
					label: `${language.totalSalesPercentage} (${((totalSalesBalance / totalBalance) * 100).toFixed(2)}%)`,
					value: `${((totalSalesBalance / totalBalance) * 100).toFixed(2)}%`,
					quantity: totalSalesBalance / totalBalance,
				});
			}

			return (
				<div className={'border-wrapper'}>
					<S.ACChartWrapper>
						<p>{language.currentOwners}</p>
						<S.ACChart>
							<PieChart quantities={quantities.reverse()} />
						</S.ACChart>
					</S.ACChartWrapper>
				</div>
			);
		} else {
			return null;
		}
	}

	function getData() {
		if (asset) {
			return (
				<>
					<S.C1Wrapper>
						<S.C1>
							<S.AssetWrapper>
								<AssetData asset={asset} frameMinHeight={550} autoLoad />
							</S.AssetWrapper>
						</S.C1>
						<S.AssetInfoWrapper>
							<S.DrawerWrapper>
								<AssetLicenses asset={asset} />
							</S.DrawerWrapper>
							<S.DrawerWrapper>
								<Drawer
									title={language.overview}
									icon={ASSETS.overview}
									content={
										<S.DrawerContent>
											<S.DCHeader>{asset.data.title}</S.DCHeader>
											<S.DCLineDetailMedium>{asset.data.description}</S.DCLineDetailMedium>
										</S.DrawerContent>
									}
								/>
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
												<TxAddress address={asset.data.id} wrap={false} />
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>
													<p>{language.blockHeight}</p>
												</S.DCLineHeader>
												<S.DCLineDetailMedium>{formatCount(asset.data.blockHeight.toString())}</S.DCLineDetailMedium>
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>
													<p>{language.dateCreated}</p>
												</S.DCLineHeader>
												<S.DCLineDetailMedium>{formatDate(asset.data.dateCreated * 1000, 'iso')}</S.DCLineDetailMedium>
											</S.DCLine>
											{asset.data.implementation && asset.data.implementation !== STORAGE.none && (
												<S.DCLine>
													<S.DCLineHeader>
														<p>{language.standard}</p>
													</S.DCLineHeader>
													<S.DCLineDetailMedium>{asset.data.implementation}</S.DCLineDetailMedium>
												</S.DCLine>
											)}
										</S.DrawerContent>
									}
								/>
							</S.DrawerWrapper>
						</S.AssetInfoWrapper>
					</S.C1Wrapper>
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
									<S.OwnerLine>
										<span>{language.currentlyBeingSoldBy}</span>
										<button
											onClick={() => {
												setShowCurrentSalesModal(true);
											}}
										>{`${currentSaleOwners.length} ${
											currentSaleOwners.length > 1 ? language.owners : language.owner
										}`}</button>
									</S.OwnerLine>
								)}
							</S.ACHeader>
						</div>
						{getChart()}
						<S.AssetCAction className={'border-wrapper-alt'}>
							<AssetDetailAction asset={asset} updateAsset={updateAsset} />
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
														<OwnerInfo owner={owner} asset={asset} isSaleOrder={true} updateAsset={updateAsset} />
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
						{currentOwners && currentOwners.length > 0 && (
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
														<OwnerInfo owner={owner} asset={asset} isSaleOrder={false} updateAsset={updateAsset} />
														<S.DCLineDetail>{`${(owner.ownerPercentage * 100).toFixed(2)}%`}</S.DCLineDetail>
													</S.DCLine>
												);
											})}
										</S.DrawerContent>
									}
								/>
							</S.DrawerWrapper>
						)}
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
											<OwnerInfo owner={owner} asset={asset} isSaleOrder={false} updateAsset={updateAsset} />
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
											<OwnerInfo owner={owner} asset={asset} isSaleOrder={true} updateAsset={updateAsset} />
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
			);
		} else {
			if (loading) {
				return <Loader />;
			} else if (errorFetchingAsset) {
				return (
					<S.Warning>
						<p>{language.errorFetchingAsset}</p>
						<Button type={'primary'} label={language.goBack} handlePress={() => navigate(-1)} noMinWidth />
					</S.Warning>
				);
			} else {
				return null;
			}
		}
	}

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper>{getData()}</S.Wrapper>
			</div>
		</div>
	);
}

async function getOwners(
	addressObject: any,
	orProvider: any,
	asset: AssetDetailType | null
): Promise<OwnerType[] | OwnerListingType[]> {
	if (asset && asset.state) {
		const balances = Object.keys(asset.state.balances).map((balance: any) => {
			return asset.state.balances[balance];
		});
		const totalBalance = balances.reduce((a: number, b: number) => a + b, 0);

		if (Array.isArray(addressObject)) {
			const owners: OwnerListingType[] = [];

			for (let i = 0; i < addressObject.length; i++) {
				if (addressObject[i].creator) {
					const profile = await orProvider.orderBook.api.getProfile({ walletAddress: addressObject[i].creator });
					let handle = profile ? profile.handle : null;

					let avatar = profile ? profile.avatar : null;
					if (avatar === 'ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA') avatar = null;
					if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

					handle =
						!handle && addressObject[i].creator === orProvider.orderBook.env.orderBookContract
							? language.orderBook
							: handle;
					owners.push({
						address: addressObject[i].creator,
						handle: handle,
						avatar: avatar,
						sellQuantity: addressObject[i].quantity,
						sellPercentage: addressObject[i].quantity / totalBalance,
						sellUnitPrice: addressObject[i].price,
					});
				}
			}

			return owners;
		} else {
			let owners: OwnerType[] = await Promise.all(
				Object.keys(addressObject).map(async (address: string) => {
					const profile = await orProvider.orderBook.api.getProfile({ walletAddress: address });
					const ownerPercentage = addressObject[address] / totalBalance;
					let handle = profile ? profile.handle : null;

					let avatar = profile ? profile.avatar : null;
					if (avatar === 'ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA') avatar = null;
					if (avatar && avatar.includes('ar://')) avatar = avatar.substring(5);

					handle = !handle && address === orProvider.orderBook.env.orderBookContract ? language.orderBook : handle;
					return {
						address: address,
						handle: handle,
						avatar: avatar,
						balance: addressObject[address],
						ownerPercentage: ownerPercentage,
					};
				})
			);

			owners = owners.filter((owner: OwnerType) => owner.balance > 0);

			return owners;
		}
	}
	return [];
}
