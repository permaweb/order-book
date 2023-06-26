import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: calc(100% + 25px);
	display: flex;
	flex-wrap: wrap;
	margin: -12.5px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0;
	}
`;

export const PICWrapper = styled.div`
	margin: 15px;
	width: calc(33.3% - 30px);
	animation: ${open} ${fadeIn2};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0 0 40px 0;
	}
`;

export const HCWrapper = styled.div`
	height: 40px;
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border-top-left-radius: ${STYLING.dimensions.borderRadius};
	border-top-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const PCWrapper = styled.div`
	height: 425px;
	width: 100%;
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const ICWrapper = styled.div`
	width: 100%;
	padding: 10px;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const ICFlex = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const AssetData = styled.div`
	height: 50px;
	width: 100%;
	margin: 10px 0;
	display: flex;
	align-items: center;
	padding: 0 10px;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	span {
		margin: 0 10px 0 0;
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;

export const AssetPrice = styled.div`
	height: 100%;
	width: 50px;
`;

export const Frame = styled.iframe`
	height: 100%;
	width: 100%;
	padding: 20px;
	scrollbar-width: none;
`;

export const NoAssetsContainer = styled.div`
	margin: 12.5px 15px;
	height: fit-content;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;
