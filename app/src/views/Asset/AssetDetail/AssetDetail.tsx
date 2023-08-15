import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initPubSub, subscribe } from 'warp-contracts-pubsub';

import { AssetDetailType, OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { APP, DRE_STATE_CHANNEL } from 'helpers/config';
import { language } from 'helpers/language';
import { checkEqualBalances } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import AssetDetailAction from './AssetDetailAction/AssetDetailAction';
import { AssetDetailInfo } from './AssetDetailInfo';
import * as S from './styles';
import { IProps } from './types';

initPubSub();

export default function AssetDetail(props: IProps) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);

	const [errorFetchingAsset, setErrorFetchingAsset] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [updating, setUpdating] = React.useState<boolean>(false);

	const [arProviderUpdate, setArProviderUpdate] = React.useState(false);
	const [orProviderUpdate, _setOrProviderUpdate] = React.useState(false);

	const [pendingOrderBookResponse, setPendingOrderBookResponse] = React.useState<{ tx: string } | null>(null);

	React.useEffect(() => {
		setAsset(null);
	}, [props.assetId]);

	React.useEffect(() => {
		arProvider.setUpdateBalance(arProviderUpdate);
	}, [arProviderUpdate]);

	React.useEffect(() => {
		(async function () {
			if (asset && localStorage.getItem(`${APP.orderTx}-${props.assetId}`)) {
				const storageItem = JSON.parse(localStorage.getItem(`${APP.orderTx}-${props.assetId}`));
				await handleUpdate({ originalTxId: storageItem.originalTxId });
			}
		})();
	}, [asset]);

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

	async function updateAsset(poll: boolean) {
		if (poll) {
			let fetchSuccess = false;
			while (!fetchSuccess) {
				await new Promise((r) => setTimeout(r, 3000));
				orProvider.setUpdate(!orProviderUpdate);

				if (orProvider && orProvider.orderBook) {
					const updatedAsset = (await orProvider.orderBook.api.getAssetById({
						id: props.assetId,
					})) as AssetDetailType;

					const currentAssetQuantities = asset.orders.reduce(
						(acc: number, order: OrderBookPairOrderType) => acc + order.quantity,
						0
					);

					const currentAssetBalances = Object.keys(asset.state.balances).map(
						(address: string) => asset.state.balances[address]
					);

					if (updateAsset && updatedAsset.state && updatedAsset.state.balances) {
						const updatedAssetBalances = Object.keys(updatedAsset.state.balances).map(
							(address: string) => asset.state.balances[address]
						);

						const updatedAssetQuantities = updatedAsset.orders.reduce(
							(acc: number, order: OrderBookPairOrderType) => acc + order.quantity,
							0
						);

						let balanceCheck: boolean;
						let quantityCheck: boolean;
						if (localStorage.getItem(`${APP.orderTx}-${props.assetId}`)) {
							const asset = JSON.parse(localStorage.getItem(`${APP.orderTx}-${props.assetId}`)).asset;

							const storageAssetQuantities = asset.orders.reduce(
								(acc: number, order: OrderBookPairOrderType) => acc + order.quantity,
								0
							);

							const storageAssetBalances = Object.keys(asset.state.balances).map(
								(address: string) => asset.state.balances[address]
							);

							quantityCheck = storageAssetQuantities === updatedAssetBalances;
							balanceCheck = checkEqualBalances(storageAssetBalances, updatedAssetBalances);
						} else {
							quantityCheck = currentAssetQuantities === updatedAssetQuantities;
							balanceCheck = checkEqualBalances(currentAssetBalances, updatedAssetBalances);
						}

						if (!quantityCheck && !balanceCheck) {
							localStorage.removeItem(`${APP.orderTx}-${props.assetId}`);
							setArProviderUpdate((prev) => !prev);
							setPendingOrderBookResponse(null);
							setUpdating(true);

							setAsset(updatedAsset);
							await new Promise((resolve) => setTimeout(resolve, 1000));
							setUpdating(false);
							fetchSuccess = true;
						}
					}
				}
			}
		} else {
			if (localStorage.getItem(`${APP.orderTx}-${props.assetId}`)) {
				localStorage.removeItem(`${APP.orderTx}-${props.assetId}`);
			}
			setArProviderUpdate((prev) => !prev);
			setPendingOrderBookResponse(null);
			setUpdating(true);

			const updatedAsset = (await orProvider.orderBook.api.getAssetById({
				id: props.assetId,
			})) as AssetDetailType;

			setAsset(updatedAsset);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setUpdating(false);
		}
	}

	async function handleUpdate(orderBookResponse: any) {
		if (asset && orderBookResponse && !localStorage.getItem(`${APP.orderTx}-${props.assetId}`)) {
			localStorage.setItem(
				`${APP.orderTx}-${props.assetId}`,
				JSON.stringify({
					originalTxId: orderBookResponse.originalTxId,
					asset: asset,
				})
			);
		}

		if (arProvider && orProvider.orderBook && orderBookResponse) {
			setPendingOrderBookResponse({ tx: orderBookResponse.originalTxId });

			if (!orderBookResponse.bundlrResponse) {
				await updateAsset(true);
			} else {
				let timeoutId: any;
				timeoutId = setTimeout(async () => {
					console.log('Fetching asset...');
					await updateAsset(true);
					if (subscription) subscription.unsubscribe();
				}, 10000);

				const subscription = await subscribe(
					DRE_STATE_CHANNEL(orProvider.orderBook.env.orderBookContract),
					async ({ data }) => {
						clearTimeout(timeoutId);
						const parsedData = JSON.parse(data);
						if (parsedData.sortKey >= orderBookResponse.bundlrResponse.sortKey && subscription) {
							subscription.unsubscribe();
							await updateAsset(false);
						}
					},
					console.error
				);
			}
		}
	}

	function getData() {
		if (asset) {
			return (
				<>
					<AssetDetailInfo asset={asset} />
					<AssetDetailAction
						asset={asset}
						handleUpdate={handleUpdate}
						pendingResponse={pendingOrderBookResponse}
						updating={updating}
					/>
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
