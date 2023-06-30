import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: calc(100% + 30px);
	display: flex;
	flex-wrap: wrap;
	margin: -15px;
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
	height: 60px;
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
	border-top-left-radius: ${STYLING.dimensions.borderRadius};
	border-top-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	> * {
		margin: 0 20px 0 0;
	}
	svg {
		height: 30px !important;
		width: 25px !important;
	}
`;

export const HCLoader = styled(HCWrapper)`
	overflow: hidden;
	> * {
		margin: 0;
	}
`;

export const RendererSVG = styled.div`
	svg {
		height: 40px !important;
		width: 40px !important;
	}
`;

export const PCWrapper = styled.div`
	height: 350px;
	width: 100%;
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const ICWrapper = styled.div`
	min-height: 50px;
	width: 100%;
	padding: 5px 15px;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
`;

export const ICLoader = styled(ICWrapper)`
	height: 50px;
	padding: 0;
	overflow: hidden;
`;

export const ICFlex = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	button {
		min-width: 42.5px;
		margin: 0 0 0 10px;
	}
`;

export const AssetData = styled.div`
	height: 50px;
	width: 100%;
	max-width: 300px;
	margin: 5px 0;
	display: flex;
	align-items: center;
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: calc(${(props) => props.theme.typography.size.base} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		max-width: 305px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.a-divider {
		margin: 0 10px;
		height: 25px;
		width: 1px;
		border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	}
`;

export const AssetDataAlt = styled(AssetData)`
	max-width: none;
	padding: 0;
	background: ${(props) => props.theme.colors.transparent};
	border: 1px solid ${(props) => props.theme.colors.transparent};
	border-radius: 0;
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt8};
	}
	.ad-divider {
		margin: 0 10px;
		height: 25px;
		width: 1px;
		border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	}
`;

export const NoAssetsContainer = styled.div`
	height: fit-content;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.warning};
	}
`;
