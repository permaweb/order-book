import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: calc(100% + 30px);
	display: flex;
	flex-wrap: wrap;
	margin: -15px;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		margin: 0;
	}
`;

export const Header = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-left: 15px;
	margin-top: 20px;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		margin: 0;
	}
`;

export const Header1 = styled.div`
	height: 40px;
	p {
		font-size: 28px;
		font-weight: ${(props) => props.theme.typography.weight.light};
	}
`;

export const PICWrapper = styled.div`
	margin: 15px;
	width: calc(33.3% - 30px);
	animation: ${open} ${fadeIn2};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	background: ${(props) => props.theme.colors.container.primary.background};
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		margin: 0 0 40px 0;
	}
`;

export const Index = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		max-width: 305px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0 0 0 20px;
	}
`;

export const HCEnd = styled.div`
	display: flex;
	align-items: center;
	margin: 0 0 0 auto;
	> * {
		margin: 0 20px 0 0;
	}
`;

export const RendererSVG = styled.div`
	svg {
		height: 30px !important;
		width: 30px !important;
	}
`;

export const PCWrapper = styled.div`
	height: 350px;
	width: 100%;
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	overflow: hidden;
`;

export const ICWrapper = styled.div`
	min-height: 100px;
	width: 100%;
	padding: 15px 20px 0 20px;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
`;

export const ICLoader = styled(ICWrapper)`
	height: 115px;
	padding: 0;
	overflow: hidden;
`;

export const ICFlex = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ICBottom = styled(ICFlex)`
	margin: 10px 0 15px 0;
`;

export const AssetData = styled.div`
	width: 250px;
	max-width: 85%;
	display: flex;
	align-items: center;
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		width: fit-content;
		max-width: 305px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const DetailAction = styled.div`
	margin: 10px 0 0 0;
	svg {
		height: 20px;
		width: 19.5px;
	}
`;

export const AssetDataAlt = styled.div``;

export const NoAssetsContainer = styled.div`
	height: fit-content;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.warning};
	}
`;
