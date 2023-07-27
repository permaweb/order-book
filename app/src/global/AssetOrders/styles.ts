import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	background: ${(props) => props.theme.colors.transparent};
`;

export const DropdownAction = styled.button`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: fit-content;
	svg {
		padding: 3.5px 0 0 0px;
		height: 18.5px;
		width: 18.5px;
	}
	&:hover {
		cursor: pointer;
		p {
			color: ${(props) => props.theme.colors.font.primary.alt6} !important;
		}
	}
	&:disabled {
		cursor: inherit;
		p {
			color: ${(props) => props.theme.colors.font.primary.alt1} !important;
		}
	}
`;

export const Dropdown = styled.div`
	width: fit-content;
	margin: 7.5px 0 0 0;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	position: absolute;
	z-index: 1;
`;

export const DropdownSubAction = styled(DropdownAction)`
	border: none;
	padding: 7.5px 10px;
`;

export const Currency = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small} !important;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		color: ${(props) => props.theme.colors.font.primary.neutral} !important;
	}
	svg {
		margin: -1px 0 0 2.5px;
		height: 20px !important;
		width: 20px !important;
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
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		color: ${(props) => props.theme.colors.font.primary.alt6} !important;
	}
	svg {
		margin: 0 0 0 7.5px;
		height: 30px !important;
		width: 25px !important;
	}
`;

export const Message = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.small} !important;
		line-height: 24px;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		color: ${(props) => props.theme.colors.font.primary.alt6} !important;
	}
`;
