import React from 'react';

import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { formatAddress } from 'helpers/utils';

import { IconButton } from '../IconButton';

import * as S from './styles';
import { IProps } from './types';

export default function TxAddress(props: IProps) {
	const [copied, setCopied] = React.useState<boolean>(false);

	const copyAddress = React.useCallback(async () => {
		if (props.address) {
			if (props.address.length > 0) {
				await navigator.clipboard.writeText(props.address);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, [props.address]);

	return (
		<>
			<S.Wrapper>
				<p>{formatAddress(props.address, props.wrap)}</p>
				<IconButton type={'primary'} src={copied ? ASSETS.checkmark : ASSETS.copy} handlePress={copyAddress} />
				{props.view && props.viewIcon && (
					<S.Details>
						<IconButton
							type={'primary'}
							src={props.viewIcon}
							handlePress={() => window.open(getTxEndpoint(props.address), '_blank')}
						/>
					</S.Details>
				)}
			</S.Wrapper>
		</>
	);
}
