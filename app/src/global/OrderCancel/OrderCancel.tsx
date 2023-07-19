import React from 'react';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { OrderBookPairOrderType } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Modal } from 'components/molecules/Modal';
import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
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
				let signer = new InjectedArweaveSigner(window.arweaveWallet);
				signer.getAddress = window.arweaveWallet.getActiveAddress;
				await signer.setPublicKey();
				const orderId = getOrderId();

				try {
					await orProvider.orderBook.cancel({
						orderId: orderId,
						wallet: signer,
						walletAddress: arProvider.walletAddress,
					});
					setCancelResponse({
						status: true,
						message: language.orderCancelled,
					});
					setCancelConfirmed(true);
				} catch (e: any) {
					console.error(e);
				}
			} catch (e: any) {
				setCancelResponse({
					status: false,
					message: e.message,
				});
			}
			setLoading(false);
		} else {
			console.error(language.cannotCancelOrder);
		}
	}

	function handleClose() {
		if (cancelConfirmed) props.updateAsset();
		setShowModal(false);
	}

	return (
		<>
			<S.Wrapper>
				<button onClick={() => setShowModal(true)}>{`(${language.cancelOrder})`}</button>
			</S.Wrapper>
			{showModal && (
				<Modal header={language.cancelOrder} handleClose={handleClose}>
					<S.ModalHeader>
						<h2>{language.cancelOrderConfirmation}</h2>
						<p>{language.cancelOrderConfirmationInfo}</p>
					</S.ModalHeader>
					<S.FlexActions>
						<Button type={'primary'} label={language.close} handlePress={handleClose} disabled={loading} />
						<Button
							type={'alt1'}
							label={language.confirm}
							handlePress={cancelOrder}
							disabled={loading || cancelConfirmed}
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
