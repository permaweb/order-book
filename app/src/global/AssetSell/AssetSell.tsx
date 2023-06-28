import React from 'react';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetSell(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [unitPrice, setUnitPrice] = React.useState<number>(0);
	const [quantity, setQuantity] = React.useState<number>(0);

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalSalesBalance, setTotalSalesBalance] = React.useState<number>(0);

	const [assetQuantity, setAssetQuantity] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [sellResponse, setSellResponse] = React.useState<ResponseType | null>(null);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			const balances = Object.keys(props.asset.state.balances).map((balance: any) => {
				return props.asset.state.balances[balance];
			});
			setTotalBalance(balances.reduce((a: number, b: number) => a + b, 0));
		}
	}, [props.asset]);

	// React.useEffect(() => {
	// 	if (props.asset && props.asset.orders) {
	// 		const saleBalances = props.asset.orders.map((order: OrderBookPairOrderType) => {
	// 			return order.quantity;
	// 		});
	// 		setTotalSalesBalance(saleBalances.reduce((a: number, b: number) => a + b, 0));
	// 	}
	// }, [props.asset]);

	// TODO: validation
	function getInvalidUnitPrice() {
		return {
			status: false,
			message: null,
		};
	}

	// TODO: validation
	function getInvalidQuantity() {
		return {
			status: false,
			message: null,
		};
	}

	// TODO: get price
	function getPrice() {
		// const currencies = props.asset.orders.map((order: OrderBookPairOrderType) => {
		// 	return order.currency;
		// });
		return (
			<S.Price>
				<p>{1.25}</p>
				{/* {currencies.every((currency: string) => currency === currencies[0]) && (
					<ReactSVG src={CURRENCY_ICONS[currencies[0]] ? CURRENCY_ICONS[currencies[0]] : ''} />
				)} */}
			</S.Price>
		);
	}

	async function sellAsset(e: any) {
		e.preventDefault();
		if (props.asset && orProvider.orderBook) {
			setLoading(true);
			console.log('List Asset For Sale');
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setLoading(false);
			setShowConfirmation(false);
			setSellResponse({
				status: true,
				message: `${language.listingSuccess}!`,
			});
		}
		// if (arProvider.walletAddress) {
		// 	e.preventDefault();

		// 	let qty = quantity;

		// 	if (props.asset.state.balances[arProvider.walletAddress] === 1) {
		// 		qty = 1;
		// 	}

		// 	if (qty === 0 || unitPrice === 0) {
		// 		throw new Error('no 0 input');
		// 	}
		// 	if (qty > props.asset.state.balances[arProvider.walletAddress]) {
		// 		throw new Error('above max quantity');
		// 	}

		// 	setLoading(true);

		// 	try {
		// 		await orProvider.orderBook?.sell({
		// 			assetId: props.asset.data.id,
		// 			qty: qty,
		// 			price: unitPrice,
		// 		});
		// 	} catch (e: any) {
		// 		throw new Error(e);
		// 	}

		// 	setLoading(false);

		// 	// setShowModal(false);

		// 	// await props.updateAsset();

		// 	// TODO: show notification
		// }
	}

	function handleModalClose(updateAsset: boolean) {
		if (updateAsset) {
			props.updateAsset();
		}
		setShowConfirmation(false);
		setSellResponse(null);
	}

	function getFields() {
		if (props.asset && arProvider.walletAddress) {
			return (
				<>
					<S.FormContainer>
						<FormField
							type={'number'}
							label={`${language.quantity} (Max: ${props.asset.state.balances[arProvider.walletAddress]})`}
							value={quantity}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseFloat(e.target.value))}
							disabled={loading || !arProvider.walletAddress}
							invalid={getInvalidQuantity()}
							tooltip={'Test'}
						/>
					</S.FormContainer>
					<S.FormContainer>
						<FormField
							type={'number'}
							label={language.unitPrice}
							value={unitPrice}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitPrice(parseFloat(e.target.value))}
							disabled={loading || !arProvider.walletAddress}
							invalid={getInvalidUnitPrice()}
							tooltip={'Test'}
						/>
					</S.FormContainer>
				</>
			);
		}
	}

	// TODO: if wallet in balances, get amount available for sale
	return (
		<>
			<S.Wrapper>
				<S.DCLine>
					<S.DCLineHeader>{`${language.totalAssetBalance}:`}</S.DCLineHeader>
					<S.DCLineDetail>{totalBalance}</S.DCLineDetail>
				</S.DCLine>
				<S.DCWrapper>
					<S.DCLine>
						<S.DCLineHeader>{`${language.totalAvailableSalesBalance}:`}</S.DCLineHeader>
						<S.DCLineDetail>{totalSalesBalance}</S.DCLineDetail>
					</S.DCLine>
					<S.DCLine>
						<S.DCLineHeader>{`${language.totalAvailableSalesPercentage}:`}</S.DCLineHeader>
						<S.DCLineDetail>{`${(totalSalesBalance / totalBalance) * 100}%`}</S.DCLineDetail>
					</S.DCLine>
				</S.DCWrapper>
				<S.Form onSubmit={async (e) => await sellAsset(e)}>
					<S.FormWrapper>{getFields()}</S.FormWrapper>
					<S.SpendWrapper>
						<S.SpendInfoWrapper>
							<S.SpendInfoContainer>
								<span>{language.totalBuyQuantity}</span>
								<p>{assetQuantity}</p>
							</S.SpendInfoContainer>
							<S.SpendInfoContainer>
								<span>{language.totalBuyPercentage}</span>
								<p>{`${((assetQuantity / totalBalance) * 100).toFixed(2)}%`}</p>
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
						<Button
							type={'alt2'}
							label={language.confirmListing.toUpperCase()}
							handlePress={(e: any) => {
								e.preventDefault();
								setShowConfirmation(true)
							}}
							height={60}
							fullWidth
							disabled={false}
							formSubmit
						/>
					</S.SellAction>
				</S.Form>
			</S.Wrapper>
			{(showConfirmation || sellResponse) && (
				<Modal
					header={language.confirmListing}
					handleClose={() => handleModalClose(sellResponse && sellResponse.status ? true : false)}
				>
					<S.ModalTitle>
						<p>{sellResponse ? sellResponse.message : props.asset.data.title}</p>
					</S.ModalTitle>
					{showConfirmation && (
						<>
							<S.SpendWrapper>
								<S.SpendInfoWrapper>
									<S.SpendInfoContainer>
										<span>{language.totalListingPercentage}</span>
										<p>{`${((assetQuantity / totalBalance) * 100).toFixed(2)}%`}</p>
									</S.SpendInfoContainer>
									<S.SpendInfoContainer>
										<span>{language.totalPrice}</span>
										{getPrice()}
									</S.SpendInfoContainer>
								</S.SpendInfoWrapper>
								<S.SpendInfoWrapper>
									<S.SpendInfoContainer>
										<span>{language.totalListingQuantity}</span>
										<p>{assetQuantity}</p>
									</S.SpendInfoContainer>
								</S.SpendInfoWrapper>
							</S.SpendWrapper>
							<S.SellAction>
								<Button
									type={'alt2'}
									label={language.listNow.toUpperCase()}
									handlePress={async (e) => await sellAsset(e)}
									height={60}
									fullWidth
									icon={ASSETS.sell}
									disabled={loading}
									loading={loading}
								/>
							</S.SellAction>
						</>
					)}
					{sellResponse && (
						<>
							<S.SellAction>
								<Button
									type={'alt2'}
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
