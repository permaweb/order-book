import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.footer`
	height: ${STYLING.dimensions.footerHeight};
	width: 100%;
	position: relative;
	z-index: 2;
	background: ${(props) => props.theme.colors.navigation.footer.background};
`;

export const Container = styled.div`
	width: 100%;
	max-width: ${STYLING.cutoffs.max};
	margin: 0 auto;
	height: ${STYLING.dimensions.footerHeight};
	padding: 0 25px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	bottom: 0;
`;

export const Content = styled.p`
	color: ${(props) => props.theme.colors.font.primary.alt1};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	font-size: 13px;
`;

export const EWrapper = styled.div`
	display: flex;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 20px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	a,
	button {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		text-decoration: none !important;
		&:hover {
			color: ${(props) => props.theme.colors.font.primary.alt8};
		}
	}
`;
