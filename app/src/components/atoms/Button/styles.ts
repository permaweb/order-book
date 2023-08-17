import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

function getHeight(height: number | undefined) {
	if (height) {
		return `${height.toString()}px`;
	} else {
		return STYLING.dimensions.buttonHeight;
	}
}

function getWidth(noMinWidth: boolean | undefined, width: number | undefined, fullWidth: boolean | undefined) {
	if (fullWidth) {
		return `100%`;
	}
	if (width) {
		return `${width.toString()}px`;
	} else {
		if (noMinWidth) {
			return 'fit-content';
		} else {
			return STYLING.dimensions.buttonWidth;
		}
	}
}

export const Primary = styled.button<{
	useMaxWidth: boolean | undefined;
	noMinWidth: boolean | undefined;
	width: number | undefined;
	fullWidth: boolean | undefined;
	height: number | undefined;
	active: boolean | undefined;
}>`
	position: relative;
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.button.primary.border};
	height: ${(props) => getHeight(props.height)};
	min-width: ${(props) => getWidth(props.noMinWidth, props.width, props.fullWidth)};
	max-width: ${(props) => (props.useMaxWidth ? STYLING.dimensions.buttonWidth : '100%')};
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	&:hover {
		border: 1px solid ${(props) => props.theme.colors.button.primary.border};
		background: ${(props) =>
			props.active ? props.theme.colors.button.primary.active.hover : props.theme.colors.button.primary.hover};
	}
	&:focus {
		border: 1px solid ${(props) => props.theme.colors.button.primary.border};
		background: ${(props) =>
			props.active ? props.theme.colors.button.primary.active.hover : props.theme.colors.button.primary.hover};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.primary.disabled.background};
		color: ${(props) => props.theme.colors.button.primary.disabled.label};
		border: 1px solid ${(props) => props.theme.colors.button.primary.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.primary.disabled.label};
		}
	}

	&:hover svg {
	}
	&:focus svg {
	}
	&:disabled svg {
	}
	@keyframes gelatine {
		from,
		to {
			transform: scale(1, 1);
		}
		25% {
			transform: scale(0.95, 1.05);
		}
		50% {
			transform: scale(1.05, 0.95);
		}
		75% {
			transform: scale(0.975, 1.025);
		}
	}

	span {
		width: fit-content;
		text-overflow: ellipsis;
		overflow: hidden;
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) =>
			props.active ? props.theme.colors.button.primary.active.label : props.theme.colors.button.primary.label};
	}
`;

export const IconPrimary = styled.div<{
	active: boolean;
	disabled: boolean;
	leftAlign: boolean;
}>`
	svg {
		height: 12.5px;
		width: 12.5px;
		padding: 1.5px 0 0 0;
		margin: ${(props) => (props.leftAlign ? '0 12.5px 0 0' : '1.5px 0 0 12.5px')};
		fill: ${(props) =>
			props.disabled
				? props.theme.colors.button.primary.disabled.label
				: props.active
				? props.theme.colors.button.primary.active.label
				: props.theme.colors.button.primary.label};
	}
`;

export const Alt1 = styled(Primary)`
	background: ${(props) =>
		props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.button.alt1.background};
	border: 1px solid
		${(props) =>
			props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.button.alt1.border};
	&:hover {
		border: 1px solid ${(props) => (props.active ? 'transparent' : props.theme.colors.button.alt1.border)};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.hover : props.theme.colors.button.alt1.hover};
	}

	&:focus {
		border: 1px solid
			${(props) =>
				props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.button.alt1.border};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.background : props.theme.colors.button.alt1.background};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.alt1.disabled.background};
		color: ${(props) => props.theme.colors.button.alt1.disabled.label};
		border: 1px solid ${(props) => props.theme.colors.button.alt1.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.alt1.disabled.label};
		}
	}
	span {
		color: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.label : props.theme.colors.button.alt1.label};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const IconSecondary = styled(IconPrimary)`
	svg {
		fill: ${(props) =>
			props.disabled
				? props.theme.colors.button.alt1.disabled.label
				: props.active
				? props.theme.colors.button.alt1.active.label
				: props.theme.colors.button.alt1.label};
	}
`;

export const Alt2 = styled(Primary)`
	transition: all 250ms;
	background: ${(props) =>
		props.active ? props.theme.colors.button.alt2.active.background : props.theme.colors.button.alt2.background};
	border: 1px solid
		${(props) =>
			props.active ? props.theme.colors.button.alt2.active.background : props.theme.colors.button.alt2.border};
	&:hover {
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt2.active.hover : props.theme.colors.button.alt2.border)};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt2.active.hover : props.theme.colors.button.alt2.hover};
	}

	&:focus {
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt2.active.hover : props.theme.colors.button.alt2.border)};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt2.active.hover : props.theme.colors.button.alt2.hover};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.alt2.disabled.background};
		color: ${(props) => props.theme.colors.button.alt2.disabled.label};
		border: 1px solid ${(props) => props.theme.colors.button.alt2.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.alt2.disabled.label};
		}
	}
	span {
		transition: all 250ms;
		color: ${(props) =>
			props.active ? props.theme.colors.button.alt1.active.label : props.theme.colors.button.alt1.label};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const IconAlt2 = styled(IconPrimary)`
	svg {
		transition: all 250ms;
		fill: ${(props) =>
			props.disabled
				? props.theme.colors.button.alt1.disabled.label
				: props.active
				? props.theme.colors.button.alt1.active.label
				: props.theme.colors.button.alt1.label};
	}
`;

export const Alt3 = styled(Primary)`
	transition: all 250ms;
	background: ${(props) =>
		props.active ? props.theme.colors.button.alt3.active.background : props.theme.colors.button.alt3.background};
	border: 1px solid
		${(props) =>
			props.active ? props.theme.colors.button.alt3.active.background : props.theme.colors.button.alt3.border};
	&:hover {
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt3.active.hover : props.theme.colors.button.alt3.border)};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt3.active.hover : props.theme.colors.button.alt3.hover};
	}

	&:focus {
		border: 1px solid
			${(props) => (props.active ? props.theme.colors.button.alt3.active.hover : props.theme.colors.button.alt3.border)};
		background: ${(props) =>
			props.active ? props.theme.colors.button.alt3.active.hover : props.theme.colors.button.alt3.hover};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.alt3.disabled.background};
		color: ${(props) => props.theme.colors.button.alt3.disabled.label};
		border: 1px solid ${(props) => props.theme.colors.button.alt3.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.alt3.disabled.label};
		}
	}

	span {
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const IconAlt3 = styled(IconPrimary)`
	svg {
		transition: all 250ms;
		fill: ${(props) =>
			props.disabled
				? props.theme.colors.button.alt3.disabled.label
				: props.active
				? props.theme.colors.button.alt3.active.label
				: props.theme.colors.button.alt3.label};
	}
`;

export const Success = styled(Alt1)`
	background: ${(props) => props.theme.colors.button.success.background};
	border: 1px solid ${(props) => props.theme.colors.button.success.background};
	&:hover {
		border: 1px solid ${(props) => props.theme.colors.button.success.background};
		background: ${(props) => props.theme.colors.button.success.hover};
	}
	&:focus {
		border: 1px solid ${(props) => props.theme.colors.button.success.background};
		background: ${(props) => props.theme.colors.button.success.hover};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.alt1.disabled.background};
		color: ${(props) => props.theme.colors.button.alt1.disabled.label};
		border: 1px solid ${(props) => props.theme.colors.button.alt1.disabled.border};
		span {
			color: ${(props) => props.theme.colors.button.alt1.disabled.label};
		}
	}
`;

export const Warning = styled(Alt2)`
	background: ${(props) => props.theme.colors.button.warning.color};
	&:hover {
		background: ${(props) => props.theme.colors.button.warning.hover};
	}
`;
