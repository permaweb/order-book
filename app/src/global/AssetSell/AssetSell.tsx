import React from 'react';

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

	const [showModal, setShowModal] = React.useState<boolean>(false);

	const [unitPrice, setUnitPrice] = React.useState<number>(0);
	const [quantity, setQuantity] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);

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

	function handleSell(e: any) {
		e.preventDefault();
		console.log(`Quantity: ${quantity}`);
		console.log(`Unit Price: ${unitPrice}`);
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
						<S.Form onSubmit={(e) => handleSell(e)}>
							<S.FormWrapper>{getFields()}</S.FormWrapper>
							<S.SubmitWrapper>
								<Button
									label={language.submit}
									type={'alt1'}
									handlePress={(e) => handleSell(e)}
									disabled={false}
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
