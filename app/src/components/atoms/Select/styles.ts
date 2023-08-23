import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: fit-content;
	width: fit-content;
	position: relative;
`;

export const Dropdown = styled.button<{ active: boolean }>`
	height: 40px;
	min-width: 250px;
	max-width: 100%;
	text-align: left;
	padding: 0 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.button.primary.border};
	border-radius: ${STYLING.dimensions.borderRadius};
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
	span {
		width: fit-content;
		text-overflow: ellipsis;
		overflow: hidden;
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) =>
			props.active ? props.theme.colors.button.primary.active.label : props.theme.colors.button.primary.label};
	}
	svg {
		padding: 5px 0 0 0;
		height: 17.5px !important;
		width: 17.5px !important;
	}
`;

export const Options = styled.ul`
	min-width: 250px;
	max-width: 100%;
	position: absolute;
	top: 50px;
	z-index: 2;
	padding: 10px 0;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.button.primary.border};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
`;

export const Option = styled.li<{ active: boolean }>`
	text-align: center;
	height: 40px;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: ${(props) => props.theme.colors.font.primary.alt8};
	font-size: ${(props) => props.theme.typography.size.xSmall};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	background: ${(props) =>
		props.active ? props.theme.colors.container.primary.hover : props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.transparent};
	padding: 0 15px;
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
`;
