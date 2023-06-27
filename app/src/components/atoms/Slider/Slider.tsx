import React from 'react';

import * as S from './styles';
import { IProps } from './types';

export default function Slider(props: IProps) {
	return (
		<S.Wrapper>
			{props.label && (
				<S.LabelWrapper>
					<S.Label>
						<p>{props.label}</p>
					</S.Label>
					<S.Value>
						<p>{`(${props.value})`}</p>
					</S.Value>
				</S.LabelWrapper>
			)}
			<S.Input
				className={'custom-range'}
				type={'range'}
				min={'0'}
				max={props.maxValue.toString()}
				step={'1'}
				value={props.value.toString()}
				onChange={props.handleChange}
			/>
		</S.Wrapper>
	);
}
