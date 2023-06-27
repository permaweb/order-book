import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
`;

export const DropdownAction = styled.button`
	height: 100%;
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	padding: 0 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	svg {
		padding: 3.5px 0 0 0px;
		height: 18.5px;
		width: 18.5px;
	}
	&:hover {
		cursor: pointer;
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
	&:disabled {
		cursor: default;
		background: ${(props) => props.theme.colors.container.primary.background};
	}
`;

export const Dropdown = styled.div`
	width: 100%;
	margin: 7.5px 0 0 0;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	position: absolute;
	z-index: 1;
`;

export const DropdownSubAction = styled(DropdownAction)`
	border: none;
	border-radius: none;
	padding: 7.5px 10px;
`;

export const Currency = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
	}
	svg {
		margin: 0 0 0 7.5px;
		height: 30px !important;
		width: 25px !important;
	}
`;

export const C2 = styled.div`
	display: flex;
	align-items: center;
`;

export const Percentage = styled.div`
	display: flex;
	align-items: center;
	margin: 0 20px 0 0;
	p {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
		color: ${(props) => props.theme.colors.font.primary.alt6} !important;
	}
	svg {
		margin: 0 0 0 7.5px;
		height: 30px !important;
		width: 25px !important;
	}
`;
