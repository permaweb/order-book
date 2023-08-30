import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const DCLineHeader = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		word-wrap: break-word;
		padding: 0 !important;
		border: none !important;
	}
`;

export const NoWrap = styled.p`
	overflow-x: hidden;
	word-wrap: normal !important;
	white-space: nowrap;
	text-overflow: ellipsis;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		max-width: 120px;
	}
`;

export const OLoader = styled.div`
	height: 15px;
	width: 60px;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	overflow: hidden;
`;

export const AvatarWrapper = styled.div`
	position: relative;
`;

export const ALink = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	height: 22.5px;
	width: 22.5px;
	border-radius: 50%;
	background: ${(props) => props.theme.colors.semiTransparentAlt3};
	opacity: 0;
	transition: ease 200ms;
	&:hover {
		opacity: 1;
	}
	a {
		display: block;
		height: 100%;
		width: 100%;
	}
`;

export const Avatar = styled.div`
	height: 22.5px;
	width: 22.5px;
	margin: 0 8.5px 0 0;
	border-radius: 50%;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	img {
		height: 100% !important;
		width: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
	}
	svg {
		height: 16.5px;
		width: 16.5px;
		padding: 3.5px 0 0 0px;
		margin: 0 0 2.5px 0;
		stroke: ${(props) => props.theme.colors.icon.alt1.fill};
	}
`;

export const OrderCancel = styled.div`
	margin: 0 0 0 5px;
`;
