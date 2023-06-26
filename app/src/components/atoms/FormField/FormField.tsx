import React from 'react';

import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';

import { IconButton } from '../IconButton';

import * as S from './styles';
import { IProps } from './types';

export default function FormField(props: IProps) {
	const [showTooltip, setShowTooltip] = React.useState<boolean>(false);

	function getValue() {
		if (props.type === 'number') {
			return isNaN(Number(props.value)) ? '' : props.value;
		} else {
			return props.value;
		}
	}

	return (
		<>
			{props.tooltip && showTooltip && (
				<Modal header={props.tooltipLabel ? props.tooltipLabel : props.label} handleClose={() => setShowTooltip(false)}>
					<S.Tooltip>
						<p>{props.tooltip}</p>
					</S.Tooltip>
				</Modal>
			)}
			<S.Wrapper sm={props.sm}>
				<S.TWrapper>
					{props.label && <S.Label>{props.label}</S.Label>}
					{props.tooltip && (
						<IconButton type={'primary'} src={ASSETS.info} handlePress={() => setShowTooltip(!showTooltip)} sm />
					)}
				</S.TWrapper>
				<S.Input
					type={props.type ? props.type : 'text'}
					value={getValue()}
					onChange={props.onChange}
					disabled={props.disabled}
					invalid={props.invalid.status}
					placeholder={props.placeholder ? props.placeholder : ''}
					sm={props.sm}
					data-testid={props.testingCtx}
				/>
				<S.EndTextContainer disabled={props.disabled} sm={props.sm}>
					{props.endText && <S.EndText sm={props.sm}>{props.endText}</S.EndText>}
				</S.EndTextContainer>
				<S.ErrorContainer>{props.invalid.message && <S.Error>{props.invalid.message}</S.Error>}</S.ErrorContainer>
			</S.Wrapper>
		</>
	);
}
