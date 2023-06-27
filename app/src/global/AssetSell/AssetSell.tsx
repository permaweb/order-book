import React from 'react';
import Arweave from 'arweave';
import { defaultCacheOptions, WarpFactory } from 'warp-contracts';

import { AssetType, OrderBook, OrderBookType, PAGINATOR } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetSell(props: IProps) {
	const arProvider = useArweaveProvider();
	const [orderBook, setOrderBook] = React.useState<OrderBookType>();

	const [showModal, setShowModal] = React.useState<boolean>(false);

	const [unitPrice, setUnitPrice] = React.useState<number>(0);
	const [quantity, setQuantity] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if(arProvider.walletAddress){
			const GET_ENDPOINT = 'arweave-search.goldsky.com';
			const POST_ENDPOINT = 'arweave.net';
	
			const PORT = 443;
			const PROTOCOL = 'https';
			const TIMEOUT = 40000;
			const LOGGING = false;
	
			let arweaveGet = Arweave.init({
				host: GET_ENDPOINT,
				port: PORT,
				protocol: PROTOCOL,
				timeout: TIMEOUT,
				logging: LOGGING,
			});
	
			let arweavePost = Arweave.init({
				host: POST_ENDPOINT,
				port: PORT,
				protocol: PROTOCOL,
				timeout: TIMEOUT,
				logging: LOGGING,
			});
	
			let warp = WarpFactory.forMainnet({
				...defaultCacheOptions,
				inMemory: true,
			});
	
			setOrderBook(
				OrderBook.init({
					currency: 'U',
					wallet: 'use_wallet',
					arweaveGet: arweaveGet,
					arweavePost: arweavePost,
					warp: warp,
					walletAddress: arProvider.walletAddress,
				})
			);
		}
	}, [arProvider.walletAddress]);

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

	async function handleSell(e: any) {
		if(arProvider.walletAddress) {
			e.preventDefault();

			let qty = quantity;

			if(props.asset.state.balances[arProvider.walletAddress] === 1) {
				qty = 1;
			}

			if(qty === 0 || unitPrice === 0) {
				throw new Error("no 0 input");
			}
			if(qty > props.asset.state.balances[arProvider.walletAddress]) {
				throw new Error("above max quantity");
			}

			setLoading(true);

			try {
				await orderBook?.sell({
					assetId: props.asset.data.id,
					qty: qty,
					price: unitPrice
				});	
			} catch(e: any) {
				throw new Error(e);
			}

			setLoading(false);

			setShowModal(false);

			await props.updateAsset();

			// TODO: show notification
		}
	}

	function getFields() {
		if (props.asset && arProvider.walletAddress) {
			return (
				<>
					{props.asset.state.balances[arProvider.walletAddress] > 1 && 
						<S.FormContainer>
							<FormField
								type={'number'}
								label={`${language.quantity} (Max: ${props.asset.state.balances[arProvider.walletAddress]})`}
								value={quantity}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseFloat(e.target.value))}
								disabled={loading || !arProvider.walletAddress}
								invalid={getInvalidQuantity()}
							/>
						</S.FormContainer>
					}
					<S.FormContainer>
						<FormField
							type={'number'}
							label={language.unitPrice}
							value={unitPrice}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitPrice(parseFloat(e.target.value))}
							disabled={loading || !arProvider.walletAddress}
							invalid={getInvalidUnitPrice()}
						/>
					</S.FormContainer>
				</>
			);
		}
	}

	return (
		<>
			{showModal && (
				<Modal header={language.sellAsset} handleClose={() => setShowModal(false)}>
					<S.ModalWrapper>
						<S.Title>{props.asset.data.title}</S.Title>
						<S.Form onSubmit={async (e) => await handleSell(e)}>
							<S.FormWrapper>{getFields()}</S.FormWrapper>
							<S.SubmitWrapper>
								<Button
									label={language.submit}
									type={'alt1'}
									handlePress={(e) => handleSell(e)}
									disabled={loading || !arProvider.walletAddress}
									loading={loading}
									formSubmit
									height={45}
								/>
							</S.SubmitWrapper>
						</S.Form>
					</S.ModalWrapper>
				</Modal>
			)}
			<Button
				type={'alt1'}
				label={language.sellAsset}
				handlePress={() => setShowModal(true)}
				height={50}
				noMinWidth
				icon={ASSETS.sell}
				iconLeftAlign
			/>
		</>
	);
}
