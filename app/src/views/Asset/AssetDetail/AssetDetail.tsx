import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { initPubSub, subscribe } from 'warp-contracts-pubsub';

import { AssetDetailType, CONTRACT_CONFIG, ORDERBOOK_CONTRACT, OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { getAssetById } from 'gql';
import { APP, CONTRACT_OPTIONS, DRE_STATE_CHANNEL } from 'helpers/config';
import { language } from 'helpers/language';
import { checkEqualBalances } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import * as ucmActions from 'store/ucm/actions';

import AssetDetailAction from './AssetDetailAction/AssetDetailAction';
import { AssetDetailInfo } from './AssetDetailInfo';
import * as S from './styles';
import { IProps } from './types';

initPubSub();

LoggerFactory.INST.logLevel('fatal');

export default function AssetDetail(props: IProps) {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);

	const [errorFetchingAsset, setErrorFetchingAsset] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [updating, setUpdating] = React.useState<boolean>(false);

	const [arProviderUpdate, setArProviderUpdate] = React.useState(false);

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
			setLoading(true);
			try {
				setAsset((await getAssetById({ id: props.assetId })) as AssetDetailType);
			} catch (e: any) {
				console.error(e);
				setErrorFetchingAsset(true);
			}
			setLoading(false);
		})();
	}, [props.assetId]);

	async function updateAsset(poll: boolean) {
		if (poll) {
			let tryCount = 0;
			let fetchSuccess = false;
			while (!fetchSuccess) {
				await new Promise((r) => setTimeout(r, 3000));
				tryCount++;

				const warp = WarpFactory.forMainnet({
					...defaultCacheOptions,
					inMemory: true,
				})
					.use(new DeployPlugin())
					.useGwUrl(CONTRACT_CONFIG.gwUrl);

				const contract = warp.contract(ORDERBOOK_CONTRACT).setEvaluationOptions(CONTRACT_OPTIONS);
				const contractState = (await contract.readState()).cachedValue.state as any;
				dispatch(ucmActions.setUCM(contractState));

				const updatedAsset = (await getAssetById({
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

					if ((!quantityCheck && !balanceCheck) || tryCount >= 10) {
						localStorage.removeItem(`${APP.orderTx}-${props.assetId}`);
						setArProviderUpdate((prev) => !prev);
						setPendingOrderBookResponse(null);
						setUpdating(true);

						setAsset(updatedAsset);
						await new Promise((resolve) => setTimeout(resolve, 1000));
						setUpdating(false);
						fetchSuccess = true;
						return;
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

			const warp = WarpFactory.forMainnet({
				...defaultCacheOptions,
				inMemory: true,
			})
				.use(new DeployPlugin())
				.useGwUrl(CONTRACT_CONFIG.gwUrl);

			const contract = warp.contract(ORDERBOOK_CONTRACT).setEvaluationOptions(CONTRACT_OPTIONS);
			const contractState = (await contract.readState()).cachedValue.state as any;
			dispatch(ucmActions.setUCM(contractState));

			const updatedAsset = (await getAssetById({
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

		if (arProvider && orderBookResponse) {
			setPendingOrderBookResponse({ tx: orderBookResponse.originalTxId });

			if (!orderBookResponse.bundlrResponse) {
				await updateAsset(true);
			} else {
				let timeoutId: any;
				timeoutId = setTimeout(async () => {
					await updateAsset(true);
					if (orderBookSubscription) orderBookSubscription.unsubscribe();
					if (assetSubscription) assetSubscription.unsubscribe();
				}, 30000);

				const orderBookSubscription = await subscribe(
					DRE_STATE_CHANNEL(ORDERBOOK_CONTRACT),
					async ({ data }) => {
						clearTimeout(timeoutId);
						const parsedData = JSON.parse(data);
						if (parsedData.sortKey >= orderBookResponse.bundlrResponse.sortKey && orderBookSubscription) {
							orderBookSubscription.unsubscribe();
							await updateAsset(false);
						}
					},
					console.error
				);

				const assetSubscription = await subscribe(
					DRE_STATE_CHANNEL(props.assetId),
					async ({ data }) => {
						clearTimeout(timeoutId);
						const parsedData = JSON.parse(data);
						if (parsedData.sortKey >= orderBookResponse.bundlrResponse.sortKey && assetSubscription) {
							assetSubscription.unsubscribe();
							await updateAsset(false);
						}
					},
					console.error
				);
			}
		}
	}

	function getAsset() {
		if (asset.state && asset.state.balances) {
			const addresses = Object.keys(asset.state.balances).map((address: any) => address);
			if (addresses.includes('0'.repeat(43))) {
				return (
					<S.Warning>
						<p>{language.assetHasBeenBurned}</p>
						<Button type={'primary'} label={language.goBack} handlePress={() => navigate(-1)} noMinWidth />
					</S.Warning>
				);
			} else {
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
			}
		}
	}

	function getData() {
		if (asset) {
			return getAsset();
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
