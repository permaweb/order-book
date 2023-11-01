import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	animation: ${open} ${fadeIn2};
`;

export const WalletDropdown = styled.ul`
	width: 350px;
	max-width: 90vw;
	padding: 20px 0 10px 0;
	position: absolute;
	top: 47.5px;
	right: 18.5px;
	z-index: 10;
	@media (max-width: ${STYLING.cutoffs.max}) {
		top: 75.5px;
	}
`;

export const DHeaderWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0 15px 20px 15px;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const DHeader = styled.div`
	margin: 0 0 0 10px;
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		margin: 0 0 5px 0;
	}
	span {
		color: ${(props) => props.theme.colors.font.primary.alt1};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
	}
`;

export const DBodyWrapper = styled.ul`
	width: 100%;
	padding: 10px 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	li {
		text-align: center;
		height: 37.5px;
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: ${(props) => props.theme.typography.size.small};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary};
		border: 1px solid transparent;
		padding: 0 15px;
		transition: all 0.05s;
		&:hover {
			background: ${(props) => props.theme.colors.container.primary.hover};
		}
	}
`;

export const DFooterWrapper = styled(DBodyWrapper)`
	padding: 10px 0 0 0;
	border-bottom: none;
`;

export const AvatarWrapper = styled.div`
	height: 60px;
	width: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.container.alt1.background};
	border: 1.5px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 50%;
	svg {
		height: 32.5px;
		width: 32.5px;
		stroke: ${(props) => props.theme.colors.icon.alt1.fill};
	}
`;

export const Avatar = styled.img`
	height: 100%;
	width: 100%;
	border-radius: 50%;
`;

export const FlexAction = styled.div`
	display: flex;
	align-items: center;
	svg {
		height: 25px;
		width: 20px;
		margin: 0 -2.5px 0 11.5px;
	}
	@media (max-width: ${STYLING.cutoffs.max}) {
		flex-direction: column-reverse;
		align-items: flex-end;
	}
`;

export const BalancesWrapper = styled.div`
	display: flex;
	align-items: center;
	@media (max-width: ${STYLING.cutoffs.max}) {
		margin: 10px 0 0 0;
		flex-direction: column;
		align-items: flex-end;
	}
`;

export const Balance = styled.div`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 10px;
	margin: 0 10px 0 0;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	svg {
		padding: 1.5px 0 0 0;
		height: 20px;
		width: 20px;
		margin: 0 0 0 5.5px;
	}
	@media (max-width: ${STYLING.cutoffs.max}) {
		margin: 0 0 0 10px;
	}
`;

export const PBalance = styled(Balance)`
	transition: all 250ms;
	a {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		text-decoration: none !important;
	}
	&:hover {
		cursor: pointer;
		background: ${(props) => props.theme.colors.button.primary.hover};
		a {
			text-decoration: none;
		}
	}
	&:focus {
		cursor: pointer;
		background: ${(props) => props.theme.colors.button.primary.hover};
		a {
			text-decoration: none;
		}
	}
`;

export const BDWrapper = styled.div`
	position: relative;
`;

export const BalanceAction = styled.button`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 10px;
	margin: 0 10px 0 0;
	background: ${(props) => props.theme.colors.button.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.button.alt2.border};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	svg {
		padding: 1.5px 0 0 0;
		height: 20px;
		width: 20px;
		margin: 0 0 0 5.5px;
	}
	&:hover {
		background: ${(props) => props.theme.colors.button.alt2.hover};
	}
	&:focus {
		background: ${(props) => props.theme.colors.button.alt2.hover};
	}
	@media (max-width: ${STYLING.cutoffs.max}) {
		margin: 10px 0;
	}
`;

export const StreakWrapper = styled.div`
	margin: 0 10px 0 0;
	@media (max-width: ${STYLING.cutoffs.max}) {
		margin: 0 0 10px 0;
	}
`;

export const BalanceDropdown = styled(WalletDropdown)`
	width: 225px;
	padding: 10px 0;
	position: absolute;
	top: 52.5px;
	right: 10px;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	background: ${(props) => props.theme.colors.container.primary.background};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	li {
		text-align: center;
		height: 35px;
		display: flex;
		align-items: center;
		cursor: pointer;
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		border: 1px solid ${(props) => props.theme.colors.transparent};
		padding: 0 15px;
		&:hover {
			background: ${(props) => props.theme.colors.container.primary.hover};
		}
	}
	@media (max-width: ${STYLING.cutoffs.max}) {
		top: 62.5px;
		left: -145px;
	}
`;

export const BDHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 5px 0;
	padding: 0 15px;
	p {
		width: fit-content;
		padding: 0 0 5px 0;
		font-size: ${(props) => props.theme.typography.size.xxSmall};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	}
	svg {
		margin: 0;
		height: 15px;
		width: 15px;
	}
`;

export const Tooltip = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: 1.5;
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;
