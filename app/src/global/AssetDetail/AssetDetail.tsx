import React from 'react';

import * as OrderBook from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Drawer } from 'components/atoms/Drawer';
import { Loader } from 'components/atoms/Loader';
import { TxAddress } from 'components/atoms/TxAddress';
import { AssetData } from 'global/AssetData';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

// TODO: if orders on asset get buy component
// TODO: else if no orders and connected wallet is owner get sell component
// TODO: if fractionally owned get sell pie chart component
// TODO: cache orders -> get order from cache by id
export default function AssetDetail(props: IProps) {
	const [asset, setAsset] = React.useState<OrderBook.AssetType | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			setLoading(true);
			const assets = await OrderBook.getAssetsByContract();
			for (let i = 0; i < assets.length; i++) {
				if (assets[i].data.id === props.assetId) {
					setAsset(assets[i]);
				}
			}
			setLoading(false);
		})();
	}, []);
	
	async function buyAsset(quantity: number) {
		if (asset) {
			setLoading(true);
			let orderbook = await OrderBook.OrderBook.init({
				currency: 'U',
				wallet: 'use_wallet',
			});

			let orderTx = await orderbook.buy({
				assetId: asset.data.id,
				qty: quantity,
			});
			setLoading(false);
			console.log(orderTx);
		}
	}

	function getAction() {
		if (asset) {
			if (asset.orders) {
				return (
					<>
						{asset.orders.map((order: OrderBook.OrderBookPairOrderType, index: number) => {
							return (
								<Button
									key={index}
									type={'alt1'}
									label={`${language.buyNow} (Price: ${order.price / 1e6} Qty: ${order.quantity})`}
									handlePress={() => buyAsset(order.quantity)}
									height={50}
									width={275}
								/>
							);
						})}
					</>
				);
			}
			else {
				return null;
			}
			// return (
			// 	<div className={'border-wrapper-alt'}>
			// 		<S.AssetCAction></S.AssetCAction>
			// 	</div>
			// );
		} else {
			return null;
		}
	}

	// TODO: get block height / owners / date created
	function getData() {
		if (asset) {
			return (
				<>
					<S.C1>
						<S.AssetWrapper>
							<AssetData asset={asset} />
						</S.AssetWrapper>
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
												{/* <S.DCLineDetail>{formatAddress(asset.data.id, true)}</S.DCLineDetail> */}
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
					</S.C1>
					<S.C2>
						<div className={'border-wrapper-alt'}>
							<S.AssetCDetail>
								<h2>{asset.data.title}</h2>
							</S.AssetCDetail>
						</div>
						{getAction()}
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
		<div className={'view-wrapper max-cutoff'}>
			<S.Wrapper>{getData()}</S.Wrapper>
		</div>
	);
}
