import React from 'react';

import { Button } from 'components/atoms/Button';
import { Modal } from 'components/molecules/Modal';

export default function ContractNotification() {
	const [showModal, setShowModal] = React.useState<boolean>(!localStorage.getItem('contractNotification'));

	function handleClose() {
		localStorage.setItem('contractNotification', 'true');
		setShowModal(false);
	}

	return showModal ? (
		<Modal header={'Warning'} handleClose={handleClose}>
			<p
				style={{
					lineHeight: 1.5,
					fontWeight: 500,
				}}
			>
				This version of BazAR is not using the production version of UCM. The production release will be announced soon.
			</p>
			<div style={{ marginTop: 20 }}>
				<Button type={'primary'} label={'Close'} handlePress={handleClose} />
			</div>
		</Modal>
	) : null;
}
