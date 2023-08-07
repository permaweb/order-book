import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';

export const Wrapper = styled.div`
	position: relative;
	animation: ${open} ${fadeIn2};
`;

export const Action = styled.button`
	color: ${(props) => props.theme.colors.font.primary.alt1};
	&:hover {
		color: ${(props) => props.theme.colors.font.primary.alt8};
	}
`;

export const Dropdown = styled.div`
	width: 300px;
	max-width: 100vw;
	position: absolute;
	right: 0;
	bottom: 25px;
	z-index: 1;
	margin: 5px 0 0 0;
	padding: 20px;
`;

export const DREWrapper = styled.div`
	p {
		width: fit-content;
		margin: 0 0 12.5px 0;
		padding: 0 0 5px 0;
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	}
	button {
		margin: 10px 0 0 0;
	}
`;
