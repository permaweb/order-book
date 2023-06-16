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
    @media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0 0 40px 0;
	}
`;

export const PCWrapper = styled.div`
	height: 425px;
	width: 100%;
	animation: ${open} ${fadeIn2};
	border-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
    background: ${(props) => props.theme.colors.container.alt1.background};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
	a {
		height: calc(100% - 42.5px);
		width: 100%;
		display: block;
	}
`;

export const ICWrapper = styled.div`
    height: 55px;
    width: 100%;
    animation: ${open} ${fadeIn2};
    margin: 15px 0 0 0;
    border-radius: ${STYLING.dimensions.borderRadius};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
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