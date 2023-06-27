import React from 'react';
import { useSelector } from 'react-redux';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetDetailType, OrderBook, OrderBookPairOrderType, OrderBookType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Drawer } from 'components/atoms/Drawer';
import { Loader } from 'components/atoms/Loader';
import { TxAddress } from 'components/atoms/TxAddress';
import { AssetData } from 'global/AssetData';
import { AssetSell } from 'global/AssetSell';
// import { StampWidget } from 'global/StampWidget';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { RootState } from 'store';

import * as S from './styles';
import { IProps } from './types';

// TODO: if orders on asset get buy component
// TODO: else if no orders and connected wallet is owner get sell component
// TODO: if fractionally owned get sell pie chart component
// TODO: cache orders -> get order from cache by id
// TODO: order book provider
// TODO: for single unit assets on buy -> send: order.price
export default function AssetDetail(props: IProps) {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [orderBook, setOrderBook] = React.useState<OrderBookType>();
	const arProvider = useArweaveProvider();

	React.useEffect(() => {
		if (arProvider.walletAddress) {
			const GET_ENDPOINT = 'arweave-search.goldsky.com';
			const POST_ENDPOINT = 'arweave.net';

			const PORT = 443;
			const PROTOCOL = 'https';
			const TIMEOUT = 40000;
			const LOGGING = false;

			let arweaveGet = Arweave.init({
				host: GET_ENDPOINT,
				port: PORT,
				protocol: PROTOCOL,
				timeout: TIMEOUT,
				logging: LOGGING,
			});

			let arweavePost = Arweave.init({
				host: POST_ENDPOINT,
				port: PORT,
				protocol: PROTOCOL,
				timeout: TIMEOUT,
				logging: LOGGING,
			});

			let warp = WarpFactory.forMainnet({
				...defaultCacheOptions,
				inMemory: true,
			});

			setOrderBook(
				OrderBook.init({
					currency: 'U',
					wallet: 'use_wallet',
					arweaveGet: arweaveGet,
					arweavePost: arweavePost,
					warp: warp,
					walletAddress: arProvider.walletAddress,
				})
			);
		}
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (orderBook) {
			(async function () {
				setLoading(true);
				setAsset(await OrderBook.api.getAssetById({ id: props.assetId }) as AssetDetailType);
				setLoading(false);
			})();
		}
	}, [orderBook]);

	async function updateAsset() {
		setAsset(await OrderBook.api.getAssetById({ id: props.assetId }) as AssetDetailType);
	}

	async function buyAsset(spend: number) {
		if (asset && orderBook) {
			setLoading(true);

			await orderBook.buy({
				assetId: asset.data.id,
				spend: spend,
			});

			setLoading(false);
		}
	}

	function getAction() {
		if (asset) {
			let sellAction;
			let buyAction;
			if (arProvider.walletAddress && asset) { // && !orders with seller
				if(Object.keys(asset.state.balances).map((balance: any) => {
					return balance;
				}).includes(arProvider.walletAddress)) {
					if((asset.state.balances[arProvider.walletAddress] !== 0)) {
						sellAction = <AssetSell asset={asset} updateAsset={() => updateAsset()}/>;	
					}
				}
			}
			if (asset.orders) {
				buyAction = (
					<>
						{asset.orders.map((order: OrderBookPairOrderType, index: number) => {
							return (
								<Button
									key={index}
									type={'alt1'}
									label={`${language.buyNow} (Price: ${order.price} Qty: ${order.quantity})`}
									handlePress={() => buyAsset(order.price * order.quantity)}
									height={50}
									width={275}
								/>
							);
						})}
					</>
				);
			}
			return (
				<>
					{buyAction}
					{sellAction}
				</>
			);
		} else {
			return null;
		}
	}

	// TODO: get block height / owners / date created
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
								<Drawer
									title={language.overview}
									icon={ASSETS.overview}
									content={
										<S.DrawerContent>
											<S.DCHeader>{asset.data.title}</S.DCHeader>
											<S.DCLineDetail>{asset.data.description}</S.DCLineDetail>
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
												<S.DCLineHeader>{language.transactionId}</S.DCLineHeader>
												<TxAddress address={asset.data.id} wrap={false} />
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>{language.blockHeight}</S.DCLineHeader>
												<S.DCLineDetail>{'12346723'}</S.DCLineDetail>
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>{language.standard}</S.DCLineHeader>
												<S.DCLineDetail>{asset.data.implementation}</S.DCLineDetail>
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>{language.owners}</S.DCLineHeader>
												<S.DCLineDetail>{'3'}</S.DCLineDetail>
											</S.DCLine>
											<S.DCLine>
												<S.DCLineHeader>{language.dateCreated}</S.DCLineHeader>
												<S.DCLineDetail>{'November 6. 2022'}</S.DCLineDetail>
											</S.DCLine>
										</S.DrawerContent>
									}
								/>
							</S.DrawerWrapper>
						</S.AssetInfoWrapper>
					</S.C1Wrapper>
					<S.C2>
						<div className={'border-wrapper'}>
							<S.ACHeader>
								<h2>{asset.data.title}</h2>
								{/* <StampWidget assetId={asset.data.id} /> */}
							</S.ACHeader>
						</div>
						{getAction()}
						<S.DrawerWrapper>
							<Drawer
								title={language.activeSaleOrders}
								icon={ASSETS.orders}
								content={
									<S.DrawerContent>
										<S.DCLine>
											<S.DCLineHeader>{language.transactionId}</S.DCLineHeader>
											<TxAddress address={asset.data.id} wrap={false} />
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.blockHeight}</S.DCLineHeader>
											<S.DCLineDetail>{'12346723'}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.standard}</S.DCLineHeader>
											<S.DCLineDetail>{asset.data.implementation}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.owners}</S.DCLineHeader>
											<S.DCLineDetail>{'3'}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.dateCreated}</S.DCLineHeader>
											<S.DCLineDetail>{'November 6. 2022'}</S.DCLineDetail>
										</S.DCLine>
									</S.DrawerContent>
								}
							/>
						</S.DrawerWrapper>
						<S.DrawerWrapper>
							<Drawer
								title={language.currentAssetOwners}
								icon={ASSETS.owners}
								content={
									<S.DrawerContent>
										<S.DCLine>
											<S.DCLineHeader>{language.transactionId}</S.DCLineHeader>
											<TxAddress address={asset.data.id} wrap={false} />
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.blockHeight}</S.DCLineHeader>
											<S.DCLineDetail>{'12346723'}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.standard}</S.DCLineHeader>
											<S.DCLineDetail>{asset.data.implementation}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.owners}</S.DCLineHeader>
											<S.DCLineDetail>{'3'}</S.DCLineDetail>
										</S.DCLine>
										<S.DCLine>
											<S.DCLineHeader>{language.dateCreated}</S.DCLineHeader>
											<S.DCLineDetail>{'November 6. 2022'}</S.DCLineDetail>
										</S.DCLine>
									</S.DrawerContent>
								}
							/>
						</S.DrawerWrapper>
					</S.C2>
				</>
			);
		} else {
			if (loading) {
				return <Loader />;
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
