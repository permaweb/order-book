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

export const FlexAction = styled.div`
	display: flex;
	align-items: center;
	svg {
		height: 25px;
		width: 20px;
		margin: 0 -2.5px 0 11.5px;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column-reverse;
		align-items: flex-end;
	}
`;

export const BalancesWrapper = styled.div`
	display: flex;
	align-items: center;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: 10px 0 0 0;
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
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: 0 0 0 10px;
	}
`;

export const WalletDropdown = styled.ul`
	width: 225px;
	padding: 10px 0;
	position: absolute;
	top: 70.5px;
	right: 19.5px;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	background: ${(props) => props.theme.colors.container.primary.background};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		top: 78.5px;
	}
	li {
		text-align: center;
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
