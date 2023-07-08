import { useEffect, useRef } from 'react';

import * as S from './styles';
import { IProps } from './types';

export default function Slider(props: IProps) {
	const rangeRef = useRef<HTMLInputElement>(null);

	// TODO: working for firefox but throwing a warnign in firefox and chrome
	useEffect(() => {
		const rangeElement = rangeRef.current;

		const handleWheel = (e) => {
			e.preventDefault();
		};

		rangeElement.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			rangeElement.removeEventListener('wheel', handleWheel);
		};
	}, []);

	return (
		<S.Wrapper>
			{props.label && (
				<S.LabelWrapper>
					<S.Label>
						<p>{props.label}</p>
					</S.Label>
					<S.Value>
						<p>{`(${props.value} / ${props.maxValue})`}</p>
					</S.Value>
				</S.LabelWrapper>
			)}
			<S.Input
				ref={rangeRef}
				className={'custom-range'}
				type={'range'}
				min={'0'}
				max={props.maxValue.toString()}
				step={'1'}
				value={props.value.toString()}
				onChange={props.handleChange}
				disabled={props.disabled}
				onWheel={(e) => e.preventDefault()}
			/>
		</S.Wrapper>
	);
}
