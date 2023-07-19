import React from 'react';

import { IconButton } from 'components/atoms/IconButton';
import { Portal } from 'components/atoms/Portal';
import { ASSETS, DOM } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

export default function Modal(props: IProps) {
	React.useEffect(() => {
		hideDocumentBody();
		return () => {
			showDocumentBody();
		};
	}, []);

	const escFunction = React.useCallback(
		(e: any) => {
			if (e.key === 'Escape') {
				props.handleClose();
			}
		},
		[props]
	);

	React.useEffect(() => {
		document.addEventListener('keydown', escFunction, false);

		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, [escFunction]);

	function getBody() {
		return (
			<>
				<S.Container noHeader={!props.header} useMax={props.useMax}>
					{props.header && (
						<S.Header>
							<S.LT>
								<S.Title>{props.header}</S.Title>
							</S.LT>
							<S.Close>
								<IconButton type={'primary'} sm warning src={ASSETS.close} handlePress={() => props.handleClose()} />
							</S.Close>
						</S.Header>
					)}
					<S.Body>{props.children}</S.Body>
				</S.Container>
				{!props.header && (
					<S.CloseTextContainer useMax={props.useMax}>
						<S.CloseButtonContainer onClick={() => props.handleClose()}>{language.close}</S.CloseButtonContainer>
					</S.CloseTextContainer>
				)}
			</>
		);
	}

	return (
		<Portal node={DOM.modal}>
			<S.Wrapper noHeader={!props.header} top={window ? (window as any).pageYOffset : 0}>
				{getBody()}
			</S.Wrapper>
		</Portal>
	);
}

let modalOpenCounter = 0;

const showDocumentBody = () => {
	modalOpenCounter -= 1;
	if (modalOpenCounter === 0) {
		document.body.style.overflow = 'auto';
	}
};

const hideDocumentBody = () => {
	modalOpenCounter += 1;
	document.body.style.overflow = 'hidden';
};
