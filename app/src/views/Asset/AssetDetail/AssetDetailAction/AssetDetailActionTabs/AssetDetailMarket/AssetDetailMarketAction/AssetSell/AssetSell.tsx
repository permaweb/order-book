import React from 'react';
import { ReactSVG } from 'react-svg';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { CURRENCY_DICT, OrderBookPairOrderType, STAMP_CONTRACT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Slider } from 'components/atoms/Slider';
import { Modal } from 'components/molecules/Modal';
import { ASSETS, CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType, ValidationType, WalletEnum } from 'helpers/types';
import { formatCount } from 'helpers/utils';
import * as windowUtils from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';
import { IProps } from './types';

export default function AssetSell(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [unitPrice, setUnitPrice] = React.useState<number>(0);
	const [quantity, setQuantity] = React.useState<number>(0);

	const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
	const [invalidQuantity, setInvalidQuantity] = React.useState<ValidationType>({
		status: false,
		message: null,
	});
	const [invalidUnitPrice, setInvalidUnitPrice] = React.useState<ValidationType>({
		status: false,
		message: null,
	});

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalSalesBalance, setTotalSalesBalance] = React.useState<number>(0);

	const [denominator, setDenominator] = React.useState<number | null>(null);

	const [connectedDisabledSale, setConnectedDisabledSale] = React.useState<boolean>(false);
	const [tradeable, setTradeable] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [sellResponse, setSellResponse] = React.useState<ResponseType | null>(null);
	const [orderBookResponse, setOrderBookResponse] = React.useState<any>(null);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			const balances = Object.keys(props.asset.state.balances).map((address: string) => {
				return props.asset.state.balances[address];
			});

			const reducedBalances = balances.reduce((a: number, b: number) => a + b, 0);
			setTotalBalance(denominator ? reducedBalances / denominator : reducedBalances);

			if (arProvider.walletAddress) {
				let salesBalance = props.asset.state.balances[arProvider.walletAddress];
				setTotalSalesBalance(salesBalance ? (denominator ? salesBalance / denominator : salesBalance) : 0);
				if (salesBalance && salesBalance === 1) {
					setQuantity(1);
				}
			}

			if (!denominator && props.asset.state.divisibility) {
				setDenominator(Math.pow(10, props.asset.state.divisibility));
			}
			if (!denominator && props.asset.data.id === STAMP_CONTRACT) {
				setDenominator(Math.pow(10, 12));
			}
		}
	}, [props.asset, arProvider.walletAddress, denominator]);

	React.useEffect(() => {
		if (arProvider && arProvider.walletAddress && props.asset && props.asset.state) {
			const addresses = Object.keys(props.asset.state.balances).map((address: string) => {
				return address;
			});
			setConnectedDisabledSale(!addresses.includes(arProvider.walletAddress));
		}
	}, [props.asset, arProvider.walletAddress]);

	React.useEffect(() => {
		if (!initialLoad) {
			if (!arProvider.walletAddress || connectedDisabledSale) {
				setInvalidQuantity({
					status: false,
					message: null,
				});
			} else {
				if (quantity <= 0) {
					setInvalidQuantity({
						status: true,
						message: language.quantityAboveZero,
					});
				} else if (quantity > props.asset.state.balances[arProvider.walletAddress]) {
					setInvalidQuantity({
						status: true,
						message: language.quantityExceedsBalance,
					});
				} else if (!Number.isInteger(quantity)) {
					setInvalidQuantity({
						status: true,
						message: language.quantityMustBeInteger,
					});
				} else {
					setInvalidQuantity({
						status: false,
						message: null,
					});
				}
			}
		}
	}, [quantity, arProvider.walletAddress]);

	React.useEffect(() => {
		if (!initialLoad) {
			if (!arProvider.walletAddress || connectedDisabledSale) {
				setInvalidUnitPrice({
					status: false,
					message: null,
				});
			} else {
				if (unitPrice <= 0) {
					setInvalidUnitPrice({
						status: true,
						message: language.unitPriceAboveZero,
					});
				} else if (unitPrice < 0.000001) {
					setInvalidUnitPrice({
						status: true,
						message: language.unitPriceAboveDecimal,
					});
				} else {
					const decimalString = unitPrice.toString();
					const decimalIndex = decimalString.indexOf('.');
					if (decimalIndex !== -1) {
						const decimalPlaces = decimalString.substring(decimalIndex + 1);
						if (decimalPlaces.length > 6) {
							setInvalidUnitPrice({
								status: true,
								message: language.unitPriceBelowDecimal,
							});
						} else {
							setInvalidUnitPrice({
								status: false,
								message: null,
							});
						}
					} else {
						setInvalidUnitPrice({
							status: false,
							message: null,
						});
					}
				}
			}
		}
	}, [unitPrice, arProvider.walletAddress]);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			setTradeable(props.asset.state.claimable ? true : false);
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (initialLoad) {
			setInitialLoad(false);
		}
	}, [quantity, unitPrice]);

	function getActionDisabled() {
		if (!arProvider.walletAddress) return true;
		if (connectedDisabledSale) return true;
		if (invalidQuantity.status || quantity <= 0 || isNaN(quantity)) return true;
		if (invalidUnitPrice.status || unitPrice <= 0 || isNaN(unitPrice)) return true;
		if (props.updating || props.pendingResponse) return true;
		return false;
	}

	function getPrice() {
		const currencies = props.asset.orders.map((order: OrderBookPairOrderType) => {
			return order.currency;
		});

		let price: number;
		if (isNaN(unitPrice) || isNaN(quantity) || quantity < 0 || unitPrice < 0) {
			price = 0;
		} else {
			price = quantity * unitPrice;
		}

		return (
			<S.Price>
				<p>{price.toFixed(4)}</p>
				{currencies.every((currency: string) => currency === currencies[0]) && (
					<ReactSVG
						src={CURRENCY_ICONS[currencies[0]] ? CURRENCY_ICONS[currencies[0]] : CURRENCY_ICONS[CURRENCY_DICT.U]}
					/>
				)}
			</S.Price>
		);
	}

	function getSellQuantity() {
		if (props.asset.data.id === STAMP_CONTRACT) {
			return quantity * 1e12;
		}
		return denominator ? quantity * denominator : quantity;
	}

	function getSellPrice() {
		if (props.asset.data.id === STAMP_CONTRACT) {
			return (unitPrice * quantity * 1e6) / getSellQuantity();
		}
		return denominator ? unitPrice : unitPrice * 1e6;
	}

	async function sellAsset(e: any) {
		e.preventDefault();
		if (props.asset && orProvider.orderBook) {
			setLoading(true);
			try {
				if (arProvider.wallet && window.arweaveWallet) {
					const signer = new InjectedArweaveSigner(arProvider.wallet);
					signer.getAddress = window.arweaveWallet.getActiveAddress;
					await signer.setPublicKey();

					const response = await orProvider.orderBook.sell({
						assetId: props.asset.data.id,
						qty: getSellQuantity(),
						price: getSellPrice(),
						wallet: signer,
						walletAddress: arProvider.walletAddress,
					});

					setOrderBookResponse(response);

					setLoading(false);
					setShowConfirmation(false);
					setSellResponse({
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
					setSellResponse({
						status: false,
						message: message,
					});
				}
			} catch (e: any) {
				console.error(e);
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
				setSellResponse({
					status: false,
					message: message,
				});
			}
		}
	}

	function handleModalClose(handleUpdate: boolean) {
		if (handleUpdate && orderBookResponse) {
			setUnitPrice(0);
			setQuantity(0);
			setInitialLoad(true);
			windowUtils.scrollTo(0, 0, 'smooth');
			props.handleUpdate(orderBookResponse);
		}
		setShowConfirmation(false);
		setSellResponse(null);
	}

	function handleQuantityInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === '' || parseFloat(e.target.value) < 0) {
			setQuantity(0);
		} else {
			if (!isNaN(Number(e.target.value))) setQuantity(parseFloat(e.target.value));
		}
	}

	function handleUnitPriceInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === '') {
			setUnitPrice(NaN);
		} else {
			if (!isNaN(Number(e.target.value))) setUnitPrice(parseFloat(e.target.value));
		}
	}

	function getFields() {
		if (props.asset) {
			return (
				<>
					<S.FormContainer>
						<FormField
							type={'number'}
							label={language.unitPrice}
							value={isNaN(unitPrice) ? '' : unitPrice}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUnitPriceInput(e)}
							disabled={loading || !arProvider.walletAddress || connectedDisabledSale || !tradeable || quantity < 1}
							invalid={invalidUnitPrice}
							tooltip={language.saleUnitPriceTooltip}
						/>
					</S.FormContainer>
				</>
			);
		}
	}

	function getTotalSalesPercentage() {
		if (totalSalesBalance <= 0 || totalBalance <= 0) return `0%`;
		return `${((totalSalesBalance / totalBalance) * 100).toFixed(2)}%`;
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
							<S.DCLineHeader>{`${language.totalAvailableSalesBalance}:`}</S.DCLineHeader>
							<S.DCLineDetail>{formatCount(totalSalesBalance.toString())}</S.DCLineDetail>
						</S.DCLine>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalAvailableSalesPercentage}:`}</S.DCLineHeader>
							<S.DCLineDetail>{getTotalSalesPercentage()}</S.DCLineDetail>
						</S.DCLine>
					</S.DCWrapper>
				) : (
					<S.Warning>
						<p>{language.assetNotTradeable}</p>
					</S.Warning>
				)}
				{connectedDisabledSale && (
					<S.Warning>
						<p>{language.connectedDisabledSale}</p>
					</S.Warning>
				)}
				<S.Form onSubmit={async (e) => await sellAsset(e)}>
					{totalSalesBalance > 1 && (
						<S.SliderWrapper>
							<Slider
								value={quantity}
								maxValue={totalSalesBalance}
								handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInput(e)}
								label={language.assetQuantityInfo}
								disabled={
									loading || !arProvider.walletAddress || connectedDisabledSale || !tradeable || totalSalesBalance <= 0
								}
							/>

							<S.FieldFlex>
								{denominator && (
									<S.FieldWrapper>
										<FormField
											type={'number'}
											value={quantity}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInput(e)}
											label={`${language.assetQuantity} (${language.max}: ${totalSalesBalance})`}
											disabled={!arProvider.walletAddress || totalSalesBalance <= 0}
											invalid={{ status: false, message: null }}
										/>
									</S.FieldWrapper>
								)}
								<S.MaxQty>
									<Button
										type={'primary'}
										label={language.max}
										handlePress={() => setQuantity(totalSalesBalance)}
										disabled={!arProvider.walletAddress || totalSalesBalance <= 0}
										noMinWidth
									/>
								</S.MaxQty>
							</S.FieldFlex>
						</S.SliderWrapper>
					)}
					<S.FormWrapper>{getFields()}</S.FormWrapper>
					<S.SpendWrapper>
						<S.SpendInfoWrapper>
							<S.SpendInfoContainer>
								<span>{language.totalListingQuantity}</span>
								<p>{isNaN(quantity) || quantity <= 0 ? 0 : formatCount(quantity.toString())}</p>
							</S.SpendInfoContainer>
							<S.SpendInfoContainer>
								<span>{language.totalListingPercentage}</span>
								<p>
									{isNaN(quantity) || quantity <= 0 || isNaN(totalBalance) || totalBalance <= 0
										? `0.00%`
										: `${((quantity / totalBalance) * 100).toFixed(2)}%`}
								</p>
							</S.SpendInfoContainer>
						</S.SpendInfoWrapper>
						<S.PriceInfoWrapper>
							<S.SpendInfoContainer>
								<span>{language.totalPrice}</span>
								{getPrice()}
							</S.SpendInfoContainer>
						</S.PriceInfoWrapper>
					</S.SpendWrapper>
					<S.SellAction>
						<S.SellActionEnd>
							<Button
								type={'alt1'}
								label={language.sell.toUpperCase()}
								handlePress={(e: any) => {
									e.preventDefault();
									setShowConfirmation(true);
								}}
								height={60}
								width={350}
								icon={ASSETS.sell}
								disabled={getActionDisabled()}
								formSubmit
							/>
						</S.SellActionEnd>
					</S.SellAction>
				</S.Form>
				{!arProvider.walletAddress && (
					<S.WalletConnectionWrapper>
						<span>{language.walletTransactionInfo}</span>
						<WalletConnect />
					</S.WalletConnectionWrapper>
				)}
			</S.Wrapper>
			{(showConfirmation || sellResponse) && (
				<Modal
					header={language.confirmListing}
					handleClose={() => handleModalClose(sellResponse && sellResponse.status ? true : false)}
				>
					<S.ModalTitle>
						{sellResponse && sellResponse.status && <p>{sellResponse.message}</p>}
						{sellResponse && !sellResponse.status && (
							<S.ErrorMessage>
								<p>{sellResponse.message}</p>
							</S.ErrorMessage>
						)}
						{!sellResponse && <p>{props.asset.data.title}</p>}
					</S.ModalTitle>
					{showConfirmation && (
						<>
							<S.SpendWrapper>
								<S.SpendInfoWrapper>
									<S.SpendInfoContainer>
										<span>{language.totalListingPercentage}</span>
										<p>{`${((quantity / totalBalance) * 100).toFixed(2)}%`}</p>
									</S.SpendInfoContainer>
									<S.SpendInfoContainer>
										<span>{language.totalPrice}</span>
										{getPrice()}
									</S.SpendInfoContainer>
								</S.SpendInfoWrapper>
								<S.SpendInfoWrapper>
									<S.SpendInfoContainer>
										<span>{language.totalListingQuantity}</span>
										<p>{quantity}</p>
									</S.SpendInfoContainer>
								</S.SpendInfoWrapper>
							</S.SpendWrapper>
							<S.SellAction>
								<Button
									type={'alt1'}
									label={language.confirmListing.toUpperCase()}
									handlePress={async (e) => await sellAsset(e)}
									height={60}
									fullWidth
									disabled={loading || getActionDisabled()}
									loading={loading}
								/>
							</S.SellAction>
						</>
					)}
					{sellResponse && (
						<>
							<S.SellAction>
								<Button
									type={'primary'}
									label={language.close.toUpperCase()}
									handlePress={() => handleModalClose(sellResponse.status ? true : false)}
									height={60}
									fullWidth
									disabled={loading}
									loading={loading}
								/>
							</S.SellAction>
						</>
					)}
				</Modal>
			)}
		</>
	);
}
