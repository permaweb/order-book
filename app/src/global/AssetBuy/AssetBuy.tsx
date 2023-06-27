import React from 'react';
import { ReactSVG } from 'react-svg';

import { OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Slider } from 'components/atoms/Slider';
import { ASSETS, CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetBuy(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalSalesBalance, setTotalSalesBalance] = React.useState<number>(0);

	const [assetQuantity, setAssetQuantity] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			const balances = Object.keys(props.asset.state.balances).map((balance: any) => {
				return props.asset.state.balances[balance];
			});
			setTotalBalance(balances.reduce((a: number, b: number) => a + b, 0));
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (props.asset && props.asset.orders) {
			const saleBalances = props.asset.orders.map((order: OrderBookPairOrderType) => {
				return order.quantity;
			});
			setTotalSalesBalance(saleBalances.reduce((a: number, b: number) => a + b, 0));
		}
	}, [props.asset]);

	const handleSpendAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAssetQuantity(Number(event.target.value));
	};

	async function buyAsset() {
		if (props.asset && orProvider.orderBook) {
			setLoading(true);
			await orProvider.orderBook.buy({
				assetId: props.asset.data.id,
				spend: assetQuantity,
			});
			setLoading(false);
		}
	}

	// TODO: get price
	function getPrice() {
		const currencies = props.asset.orders.map((order: OrderBookPairOrderType) => {
			return order.currency
		});
		return (
			<S.Price>
				<p>{1.25}</p>
				{currencies.every((currency: string) => currency === currencies[0]) && (
					<ReactSVG src={CURRENCY_ICONS[currencies[0]] ? CURRENCY_ICONS[currencies[0]] : ''} />
				)}
			</S.Price>
		);
	}

	return (
		<S.Wrapper>
			<S.DCLine>
				<S.DCLineHeader>{`${language.totalBalance}:`}</S.DCLineHeader>
				<S.DCLineDetail>{totalBalance}</S.DCLineDetail>
			</S.DCLine>
			<S.DCWrapper>
				<S.DCLine>
					<S.DCLineHeader>{`${language.totalSalesBalance}:`}</S.DCLineHeader>
					<S.DCLineDetail>{totalSalesBalance}</S.DCLineDetail>
				</S.DCLine>
				<S.DCLine>
					<S.DCLineHeader>{`${language.totalSalesPercentage}:`}</S.DCLineHeader>
					<S.DCLineDetail>{`${(totalSalesBalance / totalBalance) * 100}%`}</S.DCLineDetail>
				</S.DCLine>
			</S.DCWrapper>
			<S.SpendWrapper>
				<Slider
					value={assetQuantity}
					maxValue={totalSalesBalance}
					handleChange={handleSpendAmountChange}
					label={language.assetPercentageInfo}
				/>
				<S.SpendInfoWrapper>
					<S.SpendInfoContainer>
						<span>{language.totalBuyPercentage}</span>
						<p>{`${((assetQuantity / totalBalance) * 100).toFixed(2)}%`}</p>
					</S.SpendInfoContainer>
					<S.SpendInfoContainer>
						<span>{language.totalPrice}</span>
						{getPrice()}
					</S.SpendInfoContainer>
				</S.SpendInfoWrapper>
				<S.SpendInfoWrapper>
					<S.SpendInfoContainer>
						<span>{language.totalBuyQuantity}</span>
						<p>{assetQuantity}</p>
					</S.SpendInfoContainer>
				</S.SpendInfoWrapper>
			</S.SpendWrapper>
			<S.BuyAction>
				<Button
					type={'alt2'}
					label={language.buyNow.toUpperCase()}
					handlePress={buyAsset}
					height={60}
					fullWidth
					icon={ASSETS.buy}
				/>
			</S.BuyAction>
		</S.Wrapper>
	);
}
