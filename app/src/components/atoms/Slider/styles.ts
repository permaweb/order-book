import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div``;

export const RangeBar = styled.input.attrs({ type: 'range' })<{ value: any; max: any }>`
	border: none !important;
	padding: 0 !important;
	background: transparent !important;
	width: 100%;
	appearance: none;
	height: 15px;
	outline: none;

	&::-webkit-slider-runnable-track {
		height: 12.5px;
		border-radius: ${STYLING.dimensions.borderRadiusField};
		background: ${(props) =>
			`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
				props.theme.colors.container.primary.background
			} ${(props.value / props.max) * 100}% )`};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		transition: background 0.1s;
		&:hover {
			background: ${(props) =>
				`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
					props.theme.colors.container.primary.hover
				} ${(props.value / props.max) * 100}% )`};
			cursor: pointer;
		}
	}

	&::-moz-range-track {
		height: 12.5px;
		border-radius: ${STYLING.dimensions.borderRadiusField};
		background: ${(props) =>
			`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
				props.theme.colors.container.primary.background
			} ${(props.value / props.max) * 100}% )`};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		transition: background 0.1s;
		&:hover {
			background: ${(props) =>
				`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
					props.theme.colors.container.primary.hover
				} ${(props.value / props.max) * 100}% )`};
			cursor: pointer;
		}
	}

	&::-ms-track {
		height: 12.5px;
		border-radius: ${STYLING.dimensions.borderRadiusField};
		background: ${(props) =>
			`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
				props.theme.colors.container.primary.background
			} ${(props.value / props.max) * 100}% )`};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		transition: background 0.1s;
		&:hover {
			background: ${(props) =>
				`linear-gradient(90deg, ${props.theme.colors.container.alt8.background} ${(props.value / props.max) * 100}%, ${
					props.theme.colors.container.primary.hover
				} ${(props.value / props.max) * 100}% )`};
			cursor: pointer;
		}
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 27.5px;
		width: 10px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: 2.5px;
		cursor: pointer;
		margin-top: -8px;
	}

	&.custom-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 27.5px;
		width: 10px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: 2.5px;
		cursor: pointer;
		margin-top: -7.5px;
	}

	&.custom-range::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 27.5px;
		width: 10px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: 2.5px;
		cursor: pointer;
		margin-top: -6.5px;
	}

	&::-webkit-slider-runnable-track:before {
		content: '';
		position: absolute;
		width: ${(props) => (props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}

	&::-ms-track:before {
		content: '';
		position: absolute;
		width: ${(props) => (props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}

	&::-moz-range-track:before {
		content: '';
		position: absolute;
		width: ${(props) => (props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.alt8.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}

	&::-webkit-slider-runnable-track:after {
		content: '';
		position: absolute;
		left: ${(props) => (props.value / props.max) * 100 + '%'};
		width: ${(props) => (1 - props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.primary.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}

	&::-ms-track:after {
		content: '';
		position: absolute;
		left: ${(props) => (props.value / props.max) * 100 + '%'};
		width: ${(props) => (1 - props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.primary.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}

	&::-moz-range-track:after {
		content: '';
		position: absolute;
		left: ${(props) => (props.value / props.max) * 100 + '%'};
		width: ${(props) => (1 - props.value / props.max) * 100 + '%'};
		height: 15px;
		background: ${(props) => props.theme.colors.container.primary.background};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
`;

export const Input = styled(RangeBar)`
	width: 100%;
`;

export const LabelWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	margin: 0 0 20px 0;
`;

export const Label = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt8};
	}
`;

export const Value = styled(Label)`
	margin: 0 0 0 auto;
`;
