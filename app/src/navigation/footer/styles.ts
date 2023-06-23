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

export const SocialContainer = styled.div`
	display: flex;
	a {
		margin: 0 0 0 10px;
		color: ${(props) => props.theme.colors.font.primary.alt1};
		font-size: 13px;
		text-decoration-thickness: 1px;
	}
`;

export const Content = styled.p`
	color: ${(props) => props.theme.colors.font.primary.alt1};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	font-size: 13px;
`;
