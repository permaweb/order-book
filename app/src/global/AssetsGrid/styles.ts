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
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.borderRadius};
    overflow: hidden;
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
`;

export const ICWrapper = styled.div`
    min-height: 50px;
	width: 100%;
    padding: 5px 10px;
    background: ${(props) => props.theme.colors.container.primary.background};
	position: relative;
`;

export const ICLoader = styled(ICWrapper)`
    height: 50px;
    padding: 0;
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
    background: ${(props) => props.theme.colors.container.primary.background};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-radius: ${STYLING.dimensions.borderRadiusField};
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
        max-width: 200px;
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
	height: fit-content;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;
