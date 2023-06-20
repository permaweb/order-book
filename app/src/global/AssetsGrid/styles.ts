import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
    width: 100%;
	display: flex;
    justify-content: space-between;
	flex-wrap: wrap;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0;
	}
`;

export const PICWrapper = styled.div`
    width: calc(25% - 10px);
    min-width: 330px;
    margin: 0 0 10px 0;
    animation: ${open} ${fadeIn2};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
        min-width: none;
		margin: 0 0 20px 0;
	}
`;

export const HCWrapper = styled.div`
    height: 50px;
	width: 100%;
    background: ${(props) => props.theme.colors.container.alt1.background};
	border-top-left-radius: ${STYLING.dimensions.borderRadius};
	border-top-right-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
	display: flex;
	align-items: center;
    padding: 0 10px;
	justify-content: space-between;
    border-top: 1px solid ${(props) => props.theme.colors.border.primary};
    border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
    border-left: 1px solid ${(props) => props.theme.colors.border.primary};
    border-right: 1px solid ${(props) => props.theme.colors.border.primary};
    svg {
        height: 30px !important;
        width: 25px !important;
    }
`;

export const StampCountWrapper = styled.div`
    height: 75%;
    width: 75px;
    background: ${(props) => props.theme.colors.container.alt5.background};
    border-radius: ${STYLING.dimensions.borderRadius};
    display: flex;
    align-items: center;
    padding: 0 10px;
    p {
        font-size: ${(props) => props.theme.typography.size.base};
        font-weight: ${(props) => props.theme.typography.weight.bold};
        font-family: ${(props) => props.theme.typography.family.alt1};
        color: ${(props) => props.theme.colors.font.primary.base};
    }
    .s-divider {
        margin: 0 10px;
        height: 65%;
        width: 2px;
        border-left: 2px solid ${(props) => props.theme.colors.border.alt3};
    }
`;

export const PCWrapper = styled.div`
	height: 350px;
	width: 100%;
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const ICWrapper = styled.div`
	width: 100%;
    padding: 5px 10px;
    background: ${(props) => props.theme.colors.container.primary.background1};
    background: ${(props) => props.theme.colors.container.alt1.background};
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
    button {
        margin: 0 0 0 10px;
    }
`;

export const AssetData = styled.div`
    height: 50px;
    width: 100%;
    margin: 5px 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: ${(props) => props.theme.colors.container.primary.background1};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.borderRadiusField};
    span {
        font-size: ${(props) => props.theme.typography.size.small};
        font-weight: ${(props) => props.theme.typography.weight.regular};
        color: ${(props) => props.theme.colors.font.primary.alt1};
    }
    p {
        font-size: ${(props) => props.theme.typography.size.base};
        font-weight: ${(props) => props.theme.typography.weight.bold};
        color: ${(props) => props.theme.colors.font.primary.alt1};
    }
    .a-divider {
        margin: 0 10px;
        height: 25px;
        width: 1px;
        border-left: 1px solid ${(props) => props.theme.colors.border.primary};
    }
`;

export const AssetDataAlt = styled(AssetData)`
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
