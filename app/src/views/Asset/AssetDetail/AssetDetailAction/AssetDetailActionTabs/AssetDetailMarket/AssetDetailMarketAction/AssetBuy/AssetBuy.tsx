import React from 'react';
import { ReactSVG } from 'react-svg';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { CURRENCY_DICT, OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Slider } from 'components/atoms/Slider';
import { Modal } from 'components/molecules/Modal';
import { ASSETS, CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType, WalletEnum } from 'helpers/types';
import { formatCount } from 'helpers/utils';
import * as windowUtils from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';
import { IProps } from './types';

export default function AssetBuy(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalSalesBalance, setTotalSalesBalance] = React.useState<number>(0);
	const [assetQuantity, setAssetQuantity] = React.useState<number>(0);

	const [denominator, setDenominator] = React.useState<number | null>(null);

	const [tradeable, setTradeable] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [buyResponse, setBuyResponse] = React.useState<ResponseType | null>(null);
	const [orderBookResponse, setOrderBookResponse] = React.useState<any>(null);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			const balances = Object.keys(props.asset.state.balances).map((balance: any) => {
				return props.asset.state.balances[balance];
			});
			const reducedBalances = balances.reduce((a: number, b: number) => a + b, 0);
			setTotalBalance(denominator ? reducedBalances / denominator : reducedBalances);

			setTradeable(props.asset.state.claimable ? true : false);

			if (!denominator && props.asset.state.divisibility) {
				setDenominator(Math.pow(10, props.asset.state.divisibility));
			}
		}
	}, [props.asset, denominator]);

	React.useEffect(() => {
		if (props.asset && props.asset.orders) {
			const salesBalances = props.asset.orders.map((order: OrderBookPairOrderType) => {
				return order.quantity;
			});
			const reducedSalesBalances = salesBalances.reduce((a: number, b: number) => a + b, 0);
			setTotalSalesBalance(denominator ? reducedSalesBalances / denominator : reducedSalesBalances);
		}
	}, [props.asset, denominator]);

	React.useEffect(() => {
		if (totalSalesBalance === 1) setAssetQuantity(1);
	}, [totalSalesBalance]);

	function getActionDisabled() {
		if (!arProvider.walletAddress) return true;
		if (props.updating || props.pendingResponse) return true;
		if (arProvider && arProvider.currencyBalances) {
			const totalPrice = calcTotalPrice();
			return arProvider.currencyBalances['U'] < totalPrice || totalPrice <= 0;
		}
		return false;
	}

	const handleSpendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === '' || parseFloat(e.target.value) < 0) {
			setAssetQuantity(0);
		} else {
			if (!isNaN(Number(e.target.value))) setAssetQuantity(parseFloat(e.target.value));
		}
	};

	function calcTotalPrice() {
		let sortedOrders = props.asset.orders.sort(
			(a: OrderBookPairOrderType, b: OrderBookPairOrderType) => a.price - b.price
		);

		let totalQty = 0;
		let totalPrice = 0;
		for (let i = 0; i < sortedOrders.length; i++) {
			let order = sortedOrders[i];
			let qty = order.quantity;
			let price = order.price;

			let aQty = denominator ? assetQuantity * denominator : assetQuantity;

			if (qty >= aQty - totalQty) {
				let remainingQty = aQty - totalQty;
				totalQty += remainingQty;
				totalPrice += remainingQty * price;
				break;
			} else {
				totalQty += qty;
				totalPrice += qty * price;
			}
		}
		return totalPrice;
	}

	async function buyAsset() {
		if (props.asset && orProvider.orderBook) {
			setLoading(true);
			try {
				if (arProvider.wallet && window.arweaveWallet) {
					const signer = new InjectedArweaveSigner(arProvider.wallet);
					signer.getAddress = window.arweaveWallet.getActiveAddress;
					await signer.setPublicKey();

					const response = await orProvider.orderBook.buy({
						assetId: props.asset.data.id,
						spend: calcTotalPrice(),
						wallet: signer,
						walletAddress: arProvider.walletAddress,
					});

					setOrderBookResponse(response);

					setLoading(false);
					setShowConfirmation(false);
					setBuyResponse({
						status: true,
						message: `${language.orderPendingDescription}`,
					});
				} else {
					let message = '';
					if (arProvider.walletType === WalletEnum.arweaveApp && !arProvider.wallet['_address']) {
						message = language.arweaveAppConnectionError;
					} else {
						message = language.errorOccurred;
					}
					setLoading(false);
					setShowConfirmation(false);
					setBuyResponse({
						status: false,
						message: message,
					});
				}
			} catch (e: any) {
				let message = '';
				if (e.message) {
					message = e.message;
				} else if (arProvider.walletType === WalletEnum.arweaveApp && !arProvider.wallet['_address']) {
					message = language.arweaveAppConnectionError;
				} else {
					message = language.errorOccurred;
				}
				setLoading(false);
				setShowConfirmation(false);
				setBuyResponse({
					status: false,
					message: message,
				});
			}
		}
	}

	function handleModalClose(handleUpdate: boolean) {
		if (handleUpdate && orderBookResponse) {
			setAssetQuantity(0);
			windowUtils.scrollTo(0, 0, 'smooth');
			props.handleUpdate(orderBookResponse);
		}

		setShowConfirmation(false);
		setBuyResponse(null);
	}

	function getAmount(price: string) {
		const currencies = props.asset.orders.map((order: OrderBookPairOrderType) => {
			return order.currency;
		});

		return (
			<S.Price>
				<p>{price}</p>
				{currencies.every((currency: string) => currency === currencies[0]) && (
					<ReactSVG
						src={CURRENCY_ICONS[currencies[0]] ? CURRENCY_ICONS[currencies[0]] : CURRENCY_ICONS[CURRENCY_DICT.U]}
					/>
				)}
			</S.Price>
		);
	}

	function getSpendWrapper() {
		return (
			<S.SpendWrapper>
				{totalSalesBalance > 1 && (
					<>
						<Slider
							value={assetQuantity}
							maxValue={totalSalesBalance}
							handleChange={handleSpendAmountChange}
							label={language.assetPercentageInfo}
							disabled={!arProvider.walletAddress || totalSalesBalance <= 0}
						/>
						<S.FieldFlex>
							{denominator && (
								<S.FieldWrapper>
									<FormField
										type={'number'}
										value={assetQuantity}
										onChange={handleSpendAmountChange}
										label={`${language.assetPercentage} (${language.max}: ${totalSalesBalance})`}
										disabled={!arProvider.walletAddress || totalSalesBalance <= 0}
										invalid={{ status: false, message: null }}
									/>
								</S.FieldWrapper>
							)}
							<S.MaxQty>
								<Button
									type={'primary'}
									label={language.max}
									handlePress={() => setAssetQuantity(totalSalesBalance)}
									disabled={!arProvider.walletAddress || totalSalesBalance <= 0}
									noMinWidth
								/>
							</S.MaxQty>
						</S.FieldFlex>
						<S.SpendInfoWrapper>
							<S.SpendInfoContainer>
								<span>{language.totalBuyQuantity}</span>
								<p>{formatCount(assetQuantity.toString())}</p>
							</S.SpendInfoContainer>
							<S.SpendInfoContainer>
								<span>{language.totalBuyPercentage}</span>
								<p>{`${((assetQuantity / totalBalance) * 100).toFixed(2)}%`}</p>
							</S.SpendInfoContainer>
						</S.SpendInfoWrapper>
					</>
				)}
				<S.PriceInfoWrapper>
					<S.SpendInfoContainer>
						<span>{language.totalPrice}</span>
						{getAmount((calcTotalPrice() / 1e6).toFixed(4))}
					</S.SpendInfoContainer>
					{arProvider.currencyBalances && arProvider.currencyBalances['U'] < calcTotalPrice() && (
						<S.Warning>
							<p>{language.currencyBalanceWarning}</p>
						</S.Warning>
					)}
				</S.PriceInfoWrapper>
			</S.SpendWrapper>
		);
	}

	return (
		<>
			<S.Wrapper>
				<S.DCLine>
					<S.DCLineHeader>{`${language.totalAssetBalance}:`}</S.DCLineHeader>
					<S.DCLineDetail>{formatCount(totalBalance.toString())}</S.DCLineDetail>
				</S.DCLine>

				{tradeable ? (
					<S.DCWrapper>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalSalesBalance}:`}</S.DCLineHeader>
							<S.DCLineDetail>{formatCount(totalSalesBalance.toString())}</S.DCLineDetail>
						</S.DCLine>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalSalesPercentage}:`}</S.DCLineHeader>
							<S.DCLineDetail>{`${((totalSalesBalance / totalBalance) * 100).toFixed(2)}%`}</S.DCLineDetail>
						</S.DCLine>
					</S.DCWrapper>
				) : (
					<S.TWarning>
						<p>{language.assetNotTradeable}</p>
					</S.TWarning>
				)}

				{getSpendWrapper()}

				<S.BuyAction>
					<S.BuyActionEnd>
						<Button
							type={'alt1'}
							label={language.buy.toUpperCase()}
							handlePress={() => setShowConfirmation(true)}
							height={60}
							width={350}
							icon={ASSETS.buy}
							disabled={getActionDisabled()}
						/>
					</S.BuyActionEnd>
				</S.BuyAction>
				{!arProvider.walletAddress && (
					<S.WalletConnectionWrapper>
						<span>{language.walletTransactionInfo}</span>
						<WalletConnect />
					</S.WalletConnectionWrapper>
				)}
			</S.Wrapper>
			{(showConfirmation || buyResponse) && (
				<Modal
					header={language.confirmPurchase}
					handleClose={() => handleModalClose(buyResponse && buyResponse.status ? true : false)}
				>
					<S.ModalTitle>
						{buyResponse && buyResponse.status && (
							<>
								<p>{buyResponse.message}</p>
							</>
						)}
						{buyResponse && !buyResponse.status && (
							<S.ErrorMessage>
								<p>{buyResponse.message}</p>
							</S.ErrorMessage>
						)}
						{!buyResponse && <p>{props.asset.data.title}</p>}
					</S.ModalTitle>
					{showConfirmation && (
						<>
							<S.SpendWrapper>
								<S.SpendInfoWrapper>
									<S.SpendInfoContainer>
										<span>{language.totalBuyPercentage}</span>
										<p>{`${((assetQuantity / totalBalance) * 100).toFixed(2)}%`}</p>
									</S.SpendInfoContainer>
									<S.SpendInfoContainer>
										<span>{language.totalPrice}</span>
										{getAmount((calcTotalPrice() / 1e6).toFixed(4))}
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
									type={'alt1'}
									label={language.confirmPurchase.toUpperCase()}
									handlePress={buyAsset}
									height={60}
									fullWidth
									disabled={loading || getActionDisabled()}
									loading={loading}
								/>
							</S.BuyAction>
						</>
					)}
					{buyResponse && (
						<>
							<S.BuyAction>
								<Button
									type={'primary'}
									label={language.close.toUpperCase()}
									handlePress={() => handleModalClose(buyResponse.status ? true : false)}
									height={60}
									fullWidth
									disabled={loading}
									loading={loading}
								/>
							</S.BuyAction>
						</>
					)}
				</Modal>
			)}
		</>
	);
}
