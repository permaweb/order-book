import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: 100%;
`;

export const C1 = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
	}
`;

export const HeaderWrapper = styled.div`
	height: 40px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 0 0 20px 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: none;
	}
`;

export const HSection1 = styled.div`
	width: 49.5%;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	display: flex;
	align-items: center;
	padding: 0 20px;
	p {
		font-size: ${(props) => props.theme.typography.size.base};
        font-weight: ${(props) => props.theme.typography.weight.bold};
        color: ${(props) => props.theme.colors.font.primary.alt8};
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		display: none;
	}
`;

export const AtomicAsset = styled.p`
	margin: 0 0 0 20px;
`;

export const Listing = styled.p`
	margin: 0 0 0 165px;
`;

export const StampCount = styled.p`
	margin: 0 0 0 235px;
`;

export const HSection2 = styled(HSection1)`
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: none;
	}
`;

export const PICWrapper = styled.div`
	width: 49.5%;
	margin: 0 0 20px 0;
	a {
		text-decoration: none !important;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
	}
`;

export const PCWrapper = styled.div`
	height: 125px;
	width: 100%;
	animation: ${open} ${fadeIn2};
	position: relative;
	background: ${(props) => props.theme.colors.container.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	display: flex;
	align-items: center;
	padding: 20px;
	position: relative;
	transition: background .1s;
	p {
        font-size: ${(props) => props.theme.typography.size.base};
        font-weight: ${(props) => props.theme.typography.weight.bold};
        color: ${(props) => props.theme.colors.font.primary.alt1};
    }
	&:hover {
		cursor: pointer;
		text-decoration: none !important;
		background: ${(props) => props.theme.colors.container.alt1.background};
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		height: auto;
		flex-wrap: wrap;
	}
`;

export const AFlex = styled.div`
	display: flex;
	align-items: center;
	width: 300px;
	max-width: 100%;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0 0 20px 0;
	}
`;

export const AWrapper = styled.div`
	height: 85px;
	width: 85px;
	background: ${(props) => props.theme.colors.container.primary.background1};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	margin: 0 20px;
`;

export const AOrders = styled.div`
	height: 50px;
	width: 100%;
	max-width: 250px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		max-width: none;
		width: 90%;
	}
`;

export const SCValue = styled.div`
	margin: 0 0 0 auto;
`;

export const NoAssetsContainer = styled.div`
	margin: 12.5px 15px;
	height: fit-content;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;
