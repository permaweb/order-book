import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div``;

export const DrawerContent = styled.div<{ transparent?: boolean }>`
	width: 100%;
	padding: ${(props) => (props.transparent ? `0` : `20px`)};
	background: ${(props) =>
		props.transparent ? props.theme.colors.transparent : props.theme.colors.container.alt2.background};
	border-bottom-left-radius: ${(props) => (props.transparent ? `0` : STYLING.dimensions.borderRadiusField)};
	border-bottom-right-radius: ${(props) => (props.transparent ? `0` : STYLING.dimensions.borderRadiusField)};
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const HeaderFlex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	a {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.light};
		text-decoration: underline;
		&:hover {
			color: ${(props) => props.theme.colors.font.primary.alt8};
		}
	}
`;

export const Logo = styled.div`
	height: 80px;
	width: 200px;
	max-width: 75%;
	background: ${(props) => props.theme.colors.container.alt1.background};
	border: 1px solid ${(props) => props.theme.colors.border.alt1};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 0 10px 0;
	svg {
		height: 75px;
		width: 150px;
	}
`;

export const HeaderLink = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		word-wrap: break-word;
		margin: 0 0 5px 0;
	}
`;

export const DCLine = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
`;

export const DCLineFlex = styled.div`
	display: flex;
	align-items: center;
`;

export const DCLineHeader = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		word-wrap: break-word;
	}
`;

export const NoWrap = styled.p`
	overflow-x: hidden;
	word-wrap: normal !important;
	white-space: nowrap;
	text-overflow: ellipsis;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		max-width: 100px;
	}
`;

export const DCLineDetail = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 10px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.light};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	word-wrap: break-word;
	display: flex;
	align-items: center;
`;

export const DCLineIcon = styled.div`
	padding: 1.5px 0 0 0;
	margin: 0 0 0 7.5px;
	svg {
		height: 17.5px;
		width: 17.5px;
	}
`;
