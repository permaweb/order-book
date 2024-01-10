import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	position: relative;
	width: fit-content;
`;

export const Primary = styled.button<{
	sm: boolean | undefined;
	warning: boolean | undefined;
	disabled: boolean | undefined;
}>`
	height: auto;
	width: ${(props) => (props.sm ? '15px' : '17.5px')};
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;

	&:focus {
		outline: none;
		svg {
			opacity: ${(props) => (props.disabled ? '1' : '0.75')};
		}
	}

	svg {
		height: 100%;
		width: 100%;
		fill: ${(props) =>
			props.warning
				? props.disabled
					? props.theme.colors.icon.inactive
					: props.theme.colors.warning
				: props.theme.colors.icon.inactive};

		&:hover {
			cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
			opacity: ${(props) => (props.disabled ? '1' : '0.75')};
		}
	}
`;

export const Alt1 = styled(Primary)<{
	dimensions: { wrapper: number; icon: number } | undefined;
}>`
	transition: all 250ms ease;
	height: ${(props) => (props.dimensions ? `${props.dimensions.wrapper.toString()}px` : `32.5px`)};
	width: ${(props) => (props.dimensions ? `${props.dimensions.wrapper.toString()}px` : `32.5px`)};
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2.5px 0 0 0;
	background: ${(props) => props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.button.primary.border};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	position: relative;

	&:hover {
		background: ${(props) => props.theme.colors.button.primary.hover};
	}

	svg {
		height: ${(props) => (props.dimensions ? `${props.dimensions.icon.toString()}px` : `15px`)};
		width: ${(props) => (props.dimensions ? `${props.dimensions.icon.toString()}px` : `15px`)};
		fill: ${(props) => props.theme.colors.button.primary.label};
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&:hover {
			cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
			opacity: 1;
		}
	}

	&:disabled {
		background: ${(props) => props.theme.colors.button.primary.disabled.background};
		border: 1px solid ${(props) => props.theme.colors.button.primary.disabled.border};
		color: ${(props) => props.theme.colors.button.primary.disabled.label};
		svg {
			fill: ${(props) => props.theme.colors.button.primary.disabled.label};
		}
	}
`;

export const Alt2 = styled(Primary)`
	svg {
		fill: ${(props) => (props.warning ? props.theme.colors.warning : props.theme.colors.icon.alt1.fill)};
	}
`;

export const Alt3 = styled(Alt1)`
	background: ${(props) => props.theme.colors.container.alt3.background} !important;
	border: 1px solid ${(props) => props.theme.colors.icon.inactive} !important;
	transition: all 250ms ease;
	&:hover {
		cursor: pointer;
		opacity: 50%;
	}
	svg {
		fill: ${(props) => props.theme.colors.icon.inactive} !important;
		&:hover {
			cursor: pointer;
		}
	}
`;

export const InfoWrapper = styled.div`
	position: absolute;
	z-index: 1;
	top: 2.5px;
	left: 85%;
	height: auto;
	min-width: none;
	padding: 0.5px 7.5px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.icon.info.background};
	border: 0.75px solid ${(props) => props.theme.colors.icon.info.border};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	p {
		height: auto !important;
		margin: 0 !important;
		color: ${(props) => props.theme.colors.font.primary.base} !important;
		font-size: 12px !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
	}
`;
