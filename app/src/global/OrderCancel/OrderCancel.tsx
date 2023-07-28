import React from 'react';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType, WalletEnum } from 'helpers/types';
import { checkDesktop, checkWindowResize } from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

export default function OrderCancel(props: IProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [cancelResponse, setCancelResponse] = React.useState<ResponseType | null>(null);
	const [cancelConfirmed, setCancelConfirmed] = React.useState<boolean>(false);

	const [desktop, setDesktop] = React.useState(checkDesktop());

	function handleWindowResize() {
		if (checkDesktop()) {
			setDesktop(true);
		} else {
			setDesktop(false);
		}
	}

	checkWindowResize(handleWindowResize);

	function getOwnerOrder() {
		if (!arProvider.walletAddress) return false;
		if (props.asset && props.asset.orders && props.asset.orders.length) {
			for (let i = 0; i < props.asset.orders.length; i++) {
				if (props.asset.orders[i].creator === arProvider.walletAddress) {
					return true;
				}
			}
		}
		return false;
	}

	function getOrderId() {
		const order = props.asset.orders.find(
			(order: OrderBookPairOrderType) => order.creator === arProvider.walletAddress
		);
		if (order) return order.id;
		return null;
	}

	async function cancelOrder() {
		if (getOwnerOrder() && getOrderId() && orProvider.orderBook && arProvider.walletAddress) {
			setLoading(true);
			try {
				if (arProvider.wallet && window.arweaveWallet) {
					const signer = new InjectedArweaveSigner(arProvider.wallet);
					signer.getAddress = window.arweaveWallet.getActiveAddress;
					await signer.setPublicKey();

					const orderId = getOrderId();
					await orProvider.orderBook.cancel({
						orderId: orderId,
						wallet: signer,
						walletAddress: arProvider.walletAddress,
					});
					setLoading(false);
					setCancelResponse({
						status: true,
						message: language.orderCancelled,
					});
					setCancelConfirmed(true);
				} else {
					let message = '';
					if (arProvider.walletType === WalletEnum.arweaveApp && !arProvider.wallet['_address']) {
						message = language.arweaveAppConnectionError;
					} else {
						message = language.errorOccurred;
					}
					setLoading(false);
					setCancelResponse({
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
				setCancelResponse({
					status: false,
					message: message,
				});
			}
			setLoading(false);
		} else {
			console.error(language.cannotCancelOrder);
		}
	}

	function handleClose() {
		if (cancelConfirmed) props.handleUpdate();
		setShowModal(false);
	}

	return (
		<>
			<S.Wrapper>
				{desktop ? (
					<button onClick={() => setShowModal(true)}>{`(${language.cancelOrder})`}</button>
				) : (
					<S.IconWrapper>
						<IconButton type={'primary'} sm warning src={ASSETS.close} handlePress={() => setShowModal(true)} />
					</S.IconWrapper>
				)}
			</S.Wrapper>
			{showModal && (
				<Modal header={language.cancelOrder} handleClose={handleClose}>
					<S.ModalHeader>
						<h2>{language.cancelOrderConfirmation}</h2>
						<p>{language.cancelOrderConfirmationInfo}</p>
					</S.ModalHeader>
					<S.FlexActions>
						<Button
							type={'primary'}
							label={language.close}
							handlePress={handleClose}
							disabled={loading}
							noMinWidth={!desktop}
						/>
						<Button
							type={'alt1'}
							label={language.confirm}
							handlePress={cancelOrder}
							disabled={loading || cancelConfirmed}
							noMinWidth={!desktop}
						/>
					</S.FlexActions>
					{(cancelResponse || loading) && (
						<S.Message loading={loading ? 'true' : 'false'}>
							<p>{cancelResponse ? cancelResponse.message : `${language.loading}...`}</p>
						</S.Message>
					)}
				</Modal>
			)}
		</>
	);
}
