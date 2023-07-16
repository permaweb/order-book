import React from 'react';
import { ReactSVG } from 'react-svg';

import { CURRENCY_DICT, OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Modal } from 'components/molecules/Modal';
import { CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType, ValidationType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

// import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature'
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
	const [connectedDisabledSale, setConnectedDisabledSale] = React.useState<boolean>(false);
	const [tradeable, setTradeable] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [sellResponse, setSellResponse] = React.useState<ResponseType | null>(null);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			const balances = Object.keys(props.asset.state.balances).map((address: string) => {
				return props.asset.state.balances[address];
			});
			setTotalBalance(balances.reduce((a: number, b: number) => a + b, 0));
			if (arProvider.walletAddress) {
				let salesBalance = props.asset.state.balances[arProvider.walletAddress];
				setTotalSalesBalance(salesBalance ? salesBalance : 0);
			}
		}
	}, [props.asset]);

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
	}, [quantity]);

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
						message: 'Unit price must be above 0.000001',
					});
				} else {
					const decimalString = unitPrice.toString();
					const decimalIndex = decimalString.indexOf('.');
					if (decimalIndex !== -1) {
						const decimalPlaces = decimalString.substring(decimalIndex + 1);
						if (decimalPlaces.length > 6) {
							setInvalidUnitPrice({
								status: true,
								message: 'Unit price must have at most 6 decimal places',
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
	}, [unitPrice]);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			setTradeable(props.asset.state.claimable ? true : false);
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (initialLoad) {
			setInitialLoad(false);
		}
	}, []);

	function getActionDisabled() {
		if (!arProvider.walletAddress) return true;
		if (connectedDisabledSale) return true;
		if (invalidQuantity.status || quantity <= 0 || isNaN(quantity)) return true;
		if (invalidUnitPrice.status || unitPrice <= 0 || isNaN(unitPrice)) return true;
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

	async function sellAsset(e: any) {
		e.preventDefault();
		if (props.asset && orProvider.orderBook && arProvider.walletAddress) {
			setLoading(true);

			try {
				// let signer = new InjectedArweaveSigner(window.arweaveWallet);
				// signer.getAddress = window.arweaveWallet.getActiveAddress;
				// signer.setPublicKey();
				await orProvider.orderBook?.sell({
					assetId: props.asset.data.id,
					qty: quantity,
					price: unitPrice * 1e6,
					// wallet: signer,
					wallet: 'use_wallet',
					walletAddress: arProvider.walletAddress,
				});
				setLoading(false);
				setShowConfirmation(false);
				setSellResponse({
					status: true,
					message: `${language.listingSuccess}!`,
				});
			} catch (e: any) {
				setLoading(false);
				setShowConfirmation(false);
				setSellResponse({
					status: false,
					message: e.message,
				});
			}
		}
	}

	function handleModalClose(updateAsset: boolean) {
		if (updateAsset) {
			props.updateAsset();
		}
		setShowConfirmation(false);
		setSellResponse(null);
	}

	function handleQuantityInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === '') {
			setQuantity(NaN);
		} else {
			if (!isNaN(Number(e.target.value))) setQuantity(parseFloat(e.target.value));
		}
	}

	function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === '') {
			setUnitPrice(NaN);
		} else {
			if (!isNaN(Number(e.target.value))) setUnitPrice(parseFloat(e.target.value));
		}
	}

	function getMaxQuantityLabel() {
		let quantityLabel: string = language.quantity;
		if (!connectedDisabledSale && arProvider.walletAddress)
			quantityLabel += ` (Max: ${props.asset.state.balances[arProvider.walletAddress]})`;
		return quantityLabel;
	}

	function getFields() {
		if (props.asset) {
			return (
				<>
					<S.FormContainer>
						<FormField
							type={'number'}
							label={getMaxQuantityLabel()}
							value={quantity}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInput(e)}
							disabled={loading || !arProvider.walletAddress || connectedDisabledSale || !tradeable}
							invalid={invalidQuantity}
							tooltip={language.saleQuantityTooltip}
						/>
					</S.FormContainer>
					<S.FormContainer>
						<FormField
							type={'number'}
							label={language.unitPrice}
							value={isNaN(unitPrice) ? '' : unitPrice}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e)}
							disabled={loading || !arProvider.walletAddress || connectedDisabledSale || !tradeable}
							invalid={invalidUnitPrice}
							tooltip={language.saleUnitPriceTooltip}
						/>
					</S.FormContainer>
				</>
			);
		}
	}

	return (
		<>
			<S.Wrapper>
				<S.DCLine>
					<S.DCLineHeader>{`${language.totalAssetBalance}:`}</S.DCLineHeader>
					<S.DCLineDetail>{totalBalance}</S.DCLineDetail>
				</S.DCLine>
				{tradeable ? (
					<S.DCWrapper>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalAvailableSalesBalance}:`}</S.DCLineHeader>
							<S.DCLineDetail>{totalSalesBalance}</S.DCLineDetail>
						</S.DCLine>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalAvailableSalesPercentage}:`}</S.DCLineHeader>
							<S.DCLineDetail>{`${((totalSalesBalance / totalBalance) * 100).toFixed(2)}%`}</S.DCLineDetail>
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
					<S.FormWrapper>{getFields()}</S.FormWrapper>
					<S.SpendWrapper>
						<S.SpendInfoWrapper>
							<S.SpendInfoContainer>
								<span>{language.totalListingQuantity}</span>
								<p>{isNaN(quantity) || quantity < 0 ? 0 : quantity}</p>
							</S.SpendInfoContainer>
							<S.SpendInfoContainer>
								<span>{language.totalListingPercentage}</span>
								<p>{isNaN(quantity) || quantity < 0 ? `0.00%` : `${((quantity / totalBalance) * 100).toFixed(2)}%`}</p>
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
								label={language.confirmListing.toUpperCase()}
								handlePress={(e: any) => {
									e.preventDefault();
									setShowConfirmation(true);
								}}
								height={60}
								width={350}
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
									label={language.listNow.toUpperCase()}
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
