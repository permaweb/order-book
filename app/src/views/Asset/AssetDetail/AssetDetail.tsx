import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initPubSub, subscribe } from 'warp-contracts-pubsub';

import { AssetDetailType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { DRE_STATE_CHANNEL } from 'helpers/config';
import { language } from 'helpers/language';
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
	const [localUpdate, setLocalUpdate] = React.useState(false);

	const [pendingOrderBookResponse, setPendingOrderBookResponse] = React.useState<{ tx: string } | null>(null);

	React.useEffect(() => {
		setAsset(null);
	}, [props.assetId]);

	React.useEffect(() => {
		arProvider.setUpdateBalance(localUpdate);
	}, [localUpdate]);

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

	async function handleUpdate(orderBookResponse: any) {
		if (arProvider && orProvider.orderBook && orderBookResponse) {
			setPendingOrderBookResponse({ tx: orderBookResponse.originalTxId });

			const subscription = await subscribe(
				DRE_STATE_CHANNEL(orProvider.orderBook.env.orderBookContract),
				async ({ data }) => {
					const parsedData = JSON.parse(data);
					if (parsedData.sortKey >= orderBookResponse.bundlrResponse.sortKey && subscription) {
						subscription.unsubscribe();
						setLocalUpdate((prev) => !prev);
						setPendingOrderBookResponse(null);
						const updatedAsset = (await orProvider.orderBook.api.getAssetById({
							id: props.assetId,
						})) as AssetDetailType;
						setAsset(updatedAsset);
					}
				},
				console.error()
			);
		}
	}

	function getData() {
		if (asset) {
			return (
				<>
					<AssetDetailInfo asset={asset} />
					<AssetDetailAction asset={asset} handleUpdate={handleUpdate} pendingResponse={pendingOrderBookResponse} />
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
