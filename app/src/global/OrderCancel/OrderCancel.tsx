import React from 'react';

import { Button } from 'components/atoms/Button';
import { Modal } from 'components/molecules/Modal';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

// TODO: Render if owner order
// TODO: Find owner order to cancel
export default function OrderCancel(props: IProps) {
	const [showModal, setShowModal] = React.useState<boolean>(false);

	async function cancelOrder() {
		console.log(props.asset.orders);
	}

	return (
		<>
			<S.Wrapper>
				<button onClick={() => setShowModal(true)}>{`(${language.cancelOrder})`}</button>
			</S.Wrapper>
			{showModal && (
				<Modal header={language.cancelOrder} handleClose={() => setShowModal(false)}>
					<h2>{language.cancelOrderConfirmation}</h2>
					<S.FlexActions>
						<Button type={'primary'} label={language.close} handlePress={() => setShowModal(false)} />
						<Button type={'alt1'} label={language.confirm} handlePress={cancelOrder} />
					</S.FlexActions>
				</Modal>
			)}
		</>
	);
}
