import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	padding: 20px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		padding: 0 !important;
		background: transparent !important;
		border: none !important;
	}
`;

export const C1 = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;

export const HeaderWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;

export const AvatarWrapper = styled.div`
	height: 110px;
	width: 110px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 20px 0 0;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1.5px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	svg {
		height: 65px;
		width: 65px;
		stroke: ${(props) => props.theme.colors.icon.alt1.fill};
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 0;
	}
`;

export const Avatar = styled.img`
	height: 100%;
	width: 100%;
	border-radius: ${STYLING.dimensions.borderRadiusField};
`;

export const HeaderContainer = styled.div``;

export const Header = styled.div`
	margin: 0 0 20px 0;
	h2 {
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		text-align: left;
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		h2 {
			text-align: center;
		}
	}
`;

export const SubHeader = styled.div`
	margin: -5px 0 0 0;
	display: flex;
	align-items: center;
	width: fit-content;
	background: ${(props) => props.theme.colors.container.alt1.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	padding: 5px 10px;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		text-align: left;
	}
	button {
		margin: 2.5px 0 0 12.5px;
		svg {
			fill: ${(props) => props.theme.colors.font.primary.alt1};
		}
	}
`;

export const Action = styled.div``;

export const ShareWrapper = styled.div`
	height: fit-content;
	position: relative;
	button {
		svg {
			height: 17.5px;
			width: 17.5px;
		}
	}
`;

export const ShareDropdown = styled.ul`
	width: 225px;
	padding: 10px 0;
	position: absolute;
	top: 45px;
	right: 0;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	background: ${(props) => props.theme.colors.container.primary.background};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		top: 81.5px;
	}
	button {
		height: 100%;
		width: 100%;
		text-align: left;
		padding: 0 15px !important;
	}
	li {
		height: 35px;
		display: flex;
		align-items: center;
		cursor: pointer;
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		border: 1px solid ${(props) => props.theme.colors.transparent};
		padding: 0 15px;
		&:hover {
			background: ${(props) => props.theme.colors.container.primary.hover};
		}
	}
`;

export const Share = styled.li`
	height: 35px;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: ${(props) => props.theme.colors.font.primary.alt8};
	font-size: ${(props) => props.theme.typography.size.xxSmall};
	font-weight: ${(props) => props.theme.typography.weight.regular};
	border: 1px solid ${(props) => props.theme.colors.transparent};
	padding: 0 !important;
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
`;

export const InfoWrapper = styled.div`
	display: flex;
	align-items: center;
	margin: 30px 0 0 0;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		width: fit-content;
		margin: 30px auto 0 auto;
	}
`;

export const Info = styled.div`
	display: flex;
	align-items: center;
	span,
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
	}
	span {
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		margin: 0 0 0 5px;
	}
`;
