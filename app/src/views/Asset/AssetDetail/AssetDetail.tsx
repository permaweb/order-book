import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AssetDetailType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { language } from 'helpers/language';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import AssetDetailAction from './AssetDetailAction/AssetDetailAction';
import { AssetDetailInfo } from './AssetDetailInfo';
import * as S from './styles';
import { IProps } from './types';

export default function AssetDetail(props: IProps) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [asset, setAsset] = React.useState<AssetDetailType | null>(null);
	const [errorFetchingAsset, setErrorFetchingAsset] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);

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

	async function updateAsset() {
		if (orProvider.orderBook) {
			setAsset(null);
			setLoading(true);
			setAsset((await orProvider.orderBook.api.getAssetById({ id: props.assetId })) as AssetDetailType);
			arProvider.setUpdateBalance(!updateBalance);
			setLoading(false);
		}
	}

	function getData() {
		if (asset) {
			return (
				<>
					<AssetDetailInfo asset={asset} />
					<AssetDetailAction asset={asset} updateAsset={updateAsset} />{' '}
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
