import React from 'react';

import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { formatAddress } from 'helpers/utils';

import { IconButton } from '../IconButton';

import * as S from './styles';
import { IProps } from './types';

export default function TxAddress(props: IProps) {
	const [copied, setCopied] = React.useState<boolean>(false);
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [txResponse, setTxResponse] = React.useState<any>(null);

	const copyAddress = React.useCallback(async () => {
		if (props.address) {
			if (props.address.length > 0) {
				await navigator.clipboard.writeText(props.address);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, [props.address]);

	async function handleOpenModal() {
		setShowModal(true);
		const txResponse = await fetch(getTxEndpoint(props.address));
		const contentType = txResponse.headers.get('content-type');
		if (txResponse.status === 200 && contentType) {
			setTxResponse(await txResponse.text());
		}
	}

	return (
		<>
			<S.Wrapper>
				<p>{formatAddress(props.address, props.wrap)}</p>
				<IconButton type={'primary'} src={copied ? ASSETS.checkmark : ASSETS.copy} handlePress={copyAddress} />
				{props.view && props.viewIcon && (
					<S.Details>
						<IconButton type={'primary'} src={props.viewIcon} handlePress={handleOpenModal} />
					</S.Details>
				)}
			</S.Wrapper>
			{showModal && (
				<Modal
					header={`${language.transaction} ${formatAddress(props.address, true)}`}
					handleClose={() => setShowModal(false)}
					useMax
				>
					{txResponse ? (
						<S.TxData>
							<pre>{txResponse}</pre>
						</S.TxData>
					) : (
						<p>{`${language.loading}...`}</p>
					)}
				</Modal>
			)}
		</>
	);
}
