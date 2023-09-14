import React from 'react';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { STAMP_CONTRACT } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { IconButton } from 'components/atoms/IconButton';
import { Slider } from 'components/atoms/Slider';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType, ValidationType, WalletEnum } from 'helpers/types';
import { checkAddress, formatAddress, formatCount } from 'helpers/utils';
import * as windowUtils from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';
import { IProps } from './types';

export default function AssetTransfer(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [address, setAddress] = React.useState<string | null>(null);
	const [quantity, setQuantity] = React.useState<number>(0);

	const [initialLoad, setInitialLoad] = React.useState<boolean>(true);
	const [invalidQuantity, setInvalidQuantity] = React.useState<ValidationType>({
		status: false,
		message: null,
	});
	const [invalidAddress, setInvalidAddress] = React.useState<ValidationType>({
		status: false,
		message: null,
	});

	const [totalBalance, setTotalBalance] = React.useState<number>(0);
	const [totalTransferBalance, setTotalTransferBalance] = React.useState<number>(0);

	const [denominator, setDenominator] = React.useState<number | null>(null);

	const [connectedDisabledTransfer, setConnectedDisabledTransfer] = React.useState<boolean>(false);
	const [tradeable, setTradeable] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [transferResponse, setTransferResponse] = React.useState<ResponseType | null>(null);
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
				setTotalTransferBalance(salesBalance ? (denominator ? salesBalance / denominator : salesBalance) : 0);
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
			setConnectedDisabledTransfer(
				!addresses.includes(arProvider.walletAddress) || props.asset.state.balances[arProvider.walletAddress] <= 0
			);
		}
	}, [props.asset, arProvider.walletAddress]);

	React.useEffect(() => {
		if (!initialLoad) {
			if (!arProvider.walletAddress || connectedDisabledTransfer) {
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
			if (!arProvider.walletAddress || connectedDisabledTransfer) {
				setInvalidAddress({
					status: false,
					message: null,
				});
			} else {
				if (!checkAddress(address)) {
					setInvalidAddress({
						status: true,
						message: language.invalidAddress,
					});
				} else {
					setInvalidAddress({
						status: false,
						message: null,
					});
				}
			}
		}
	}, [address, arProvider.walletAddress]);

	React.useEffect(() => {
		if (props.asset && props.asset.state) {
			setTradeable(props.asset.state.claimable ? true : false);
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (initialLoad) {
			setInitialLoad(false);
		}
	}, [quantity]);

	const handlePaste = async () => {
		if (!navigator.clipboard || !navigator.clipboard.readText) {
			console.error('Clipboard API not supported');
			return;
		}
		try {
			const clipboardText = await navigator.clipboard.readText();
			setAddress(clipboardText);
		} catch (error) {
			console.error(error);
		}
	};

	function getActionDisabled() {
		if (!arProvider.walletAddress) return true;
		if (connectedDisabledTransfer) return true;
		if (invalidQuantity.status || quantity <= 0 || isNaN(quantity)) return true;
		if (!address || invalidAddress.status) return true;
		if (props.updating || props.pendingResponse) return true;
		return false;
	}

	async function transferAsset(e: any) {
		e.preventDefault();
		if (props.asset && orProvider.orderBook) {
			setLoading(true);
			try {
				if (arProvider.wallet && window.arweaveWallet) {
					const signer = new InjectedArweaveSigner(arProvider.wallet);
					signer.getAddress = window.arweaveWallet.getActiveAddress;
					await signer.setPublicKey();

					const response = await orProvider.orderBook.api.arClient.writeContract({
						contract: props.asset.data.id,
						wallet: signer,
						input: {
							function: 'transfer',
							target: address.trim(),
							qty: denominator ? quantity * denominator : quantity,
						},
					});

					setOrderBookResponse(response);

					setLoading(false);
					setShowConfirmation(false);
					setTransferResponse({
						status: true,
						message: `${language.transferPendingDescription}`,
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
					setTransferResponse({
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
				setTransferResponse({
					status: false,
					message: message,
				});
			}
		}
	}

	function handleModalClose(handleUpdate: boolean) {
		if (handleUpdate && orderBookResponse) {
			setQuantity(0);
			setAddress(null);
			setInitialLoad(true);
			windowUtils.scrollTo(0, 0, 'smooth');
			props.handleUpdate(orderBookResponse);
		}
		setShowConfirmation(false);
		setTransferResponse(null);
	}

	function handleQuantityInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === '' || parseFloat(e.target.value) < 0) {
			setQuantity(0);
		} else {
			if (!isNaN(Number(e.target.value))) setQuantity(parseFloat(e.target.value));
		}
	}

	function handleAddressInput(e: React.ChangeEvent<HTMLInputElement>) {
		setAddress(e.target.value);
	}

	function getFields() {
		if (props.asset) {
			return (
				<S.AddressWrapper>
					<S.FormContainer>
						<FormField
							label={language.address}
							value={address || ''}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressInput(e)}
							disabled={loading || !arProvider.walletAddress || connectedDisabledTransfer || !tradeable}
							invalid={invalidAddress}
						/>
					</S.FormContainer>
					{navigator && navigator.clipboard && navigator.clipboard.readText && (
						<IconButton
							type={'alt1'}
							src={ASSETS.paste}
							tooltip={language.pasteFromClipboard}
							handlePress={handlePaste}
							disabled={loading || !arProvider.walletAddress || connectedDisabledTransfer || !tradeable}
						/>
					)}
				</S.AddressWrapper>
			);
		}
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
							<S.DCLineHeader>{`${language.totalAvailableTransferBalance}:`}</S.DCLineHeader>
							<S.DCLineDetail>{formatCount(totalTransferBalance.toString())}</S.DCLineDetail>
						</S.DCLine>
						<S.DCLine>
							<S.DCLineHeader>{`${language.totalAvailableTransferPercentage}:`}</S.DCLineHeader>
							<S.DCLineDetail>{`${((totalTransferBalance / totalBalance) * 100).toFixed(2)}%`}</S.DCLineDetail>
						</S.DCLine>
					</S.DCWrapper>
				) : (
					<S.Warning>
						<p>{language.assetNotTradeable}</p>
					</S.Warning>
				)}
				{connectedDisabledTransfer && (
					<S.Warning>
						<p>{language.connectedDisabledTransfer}</p>
					</S.Warning>
				)}
				<S.Form onSubmit={async (e) => await transferAsset(e)}>
					{totalTransferBalance > 1 && (
						<S.SliderWrapper>
							<Slider
								value={quantity}
								maxValue={totalTransferBalance}
								handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInput(e)}
								label={language.assetQuantityInfo}
								disabled={
									loading ||
									!arProvider.walletAddress ||
									connectedDisabledTransfer ||
									!tradeable ||
									totalTransferBalance <= 0
								}
							/>

							<S.FieldFlex>
								{denominator && (
									<S.FieldWrapper>
										<FormField
											type={'number'}
											value={quantity}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInput(e)}
											label={`${language.assetQuantity} (${language.max}: ${totalTransferBalance})`}
											disabled={!arProvider.walletAddress || totalTransferBalance <= 0}
											invalid={{ status: false, message: null }}
										/>
									</S.FieldWrapper>
								)}
								<S.MaxQty>
									<Button
										type={'primary'}
										label={language.max}
										handlePress={() => setQuantity(totalTransferBalance)}
										disabled={!arProvider.walletAddress || totalTransferBalance <= 0}
										noMinWidth
									/>
								</S.MaxQty>
							</S.FieldFlex>
						</S.SliderWrapper>
					)}
					<S.FormWrapper>{getFields()}</S.FormWrapper>
					<S.TransferWrapper>
						<S.TransferInfoWrapper>
							<S.TransferInfoContainer>
								<span>{language.totalTransferQuantity}</span>
								<p>{isNaN(quantity) || quantity < 0 ? 0 : formatCount(quantity.toString())}</p>
							</S.TransferInfoContainer>
							<S.TransferInfoContainer>
								<span>{language.totalTransferPercentage}</span>
								<p>{isNaN(quantity) || quantity < 0 ? `0.00%` : `${((quantity / totalBalance) * 100).toFixed(2)}%`}</p>
							</S.TransferInfoContainer>
						</S.TransferInfoWrapper>
					</S.TransferWrapper>
					<S.TransferAction>
						<S.TransferActionEnd>
							<Button
								type={'alt1'}
								label={language.transfer.toUpperCase()}
								handlePress={(e: any) => {
									e.preventDefault();
									setShowConfirmation(true);
								}}
								height={60}
								width={350}
								icon={ASSETS.transfer}
								disabled={getActionDisabled()}
								formSubmit
							/>
						</S.TransferActionEnd>
					</S.TransferAction>
				</S.Form>
				{!arProvider.walletAddress && (
					<S.WalletConnectionWrapper>
						<span>{language.walletTransactionInfo}</span>
						<WalletConnect />
					</S.WalletConnectionWrapper>
				)}
			</S.Wrapper>
			{(showConfirmation || transferResponse) && (
				<Modal
					header={language.confirmTransfer}
					handleClose={() => handleModalClose(transferResponse && transferResponse.status ? true : false)}
				>
					<S.ModalTitle>
						{transferResponse && transferResponse.status && <p>{transferResponse.message}</p>}
						{transferResponse && !transferResponse.status && (
							<S.ErrorMessage>
								<p>{transferResponse.message}</p>
							</S.ErrorMessage>
						)}
						{!transferResponse && <p>{props.asset.data.title}</p>}
					</S.ModalTitle>
					{showConfirmation && (
						<>
							<S.TransferWrapper>
								<S.TransferInfoWrapper>
									<S.TransferInfoContainer>
										<span>{language.totalTransferPercentage}</span>
										<p>{`${((quantity / totalBalance) * 100).toFixed(2)}%`}</p>
									</S.TransferInfoContainer>
									<S.TransferInfoContainer>
										<span>{language.totalTransferQuantity}</span>
										<p>{quantity}</p>
									</S.TransferInfoContainer>
								</S.TransferInfoWrapper>
								<S.TransferInfoWrapper>
									<S.TransferInfoContainer>
										<span>{language.recipientAddress}</span>
										<p>{formatAddress(address, true)}</p>
									</S.TransferInfoContainer>
								</S.TransferInfoWrapper>
							</S.TransferWrapper>
							<S.TransferAction>
								<Button
									type={'alt1'}
									label={language.confirmTransfer.toUpperCase()}
									handlePress={async (e) => await transferAsset(e)}
									height={60}
									fullWidth
									disabled={loading || getActionDisabled()}
									loading={loading}
								/>
							</S.TransferAction>
						</>
					)}
					{transferResponse && (
						<>
							<S.TransferAction>
								<Button
									type={'primary'}
									label={language.close.toUpperCase()}
									handlePress={() => handleModalClose(transferResponse.status ? true : false)}
									height={60}
									fullWidth
									disabled={loading}
									loading={loading}
								/>
							</S.TransferAction>
						</>
					)}
				</Modal>
			)}
		</>
	);
}
