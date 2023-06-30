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
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		flex-direction: column;
	}
`;

export const HeaderWrapper = styled.div`
	height: 40px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 0 0 20px 0;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		display: none;
	}
`;

export const HSection1 = styled.div`
	width: 49.5%;
	background: ${(props) => props.theme.colors.container.primary.background};
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
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		display: none;
	}
`;

export const AtomicAsset = styled.div`
	min-width: 110px;
	margin: 0 0 0 20px;
`;

export const Listing = styled.div``;

export const StampCount = styled.div``;

export const HSection2 = styled(HSection1)`
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		display: none;
	}
`;

export const PICWrapper = styled.div`
	width: 49.5%;
	margin: 0 0 20px 0;
	a {
		text-decoration: none !important;
	}
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
	}
`;

export const PCWrapper = styled.div`
	min-height: 125px;
	width: 100%;
	animation: ${open} ${fadeIn2};
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 20px;
	position: relative;
	transition: background 0.1s;
	p {
		max-width: 125px;
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: calc(${(props) => props.theme.typography.size.base} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	&:hover {
		cursor: pointer;
		text-decoration: none !important;
		background: ${(props) => props.theme.colors.container.alt2.background};
	}
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		height: auto;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const PCLoader = styled(PCWrapper)`
	height: 125px;
	padding: 0;
	overflow: hidden;
	&:hover {
		cursor: default;
	}
`;

export const AFlex = styled.div`
	display: flex;
	align-items: center;
	width: 280px;
	max-width: 100%;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		margin: 0 0 20px 0;
	}
`;

export const AWrapper = styled.div`
	height: 85px;
	width: 85px;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	margin: 0 15px;
`;

export const AOrders = styled.div`
	height: 50px;
	width: 235px;
`;

export const SCValue = styled.div`
	margin: 0 0 0 auto;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		margin: 20px 0 0 0;
	}
`;

export const NoAssetsContainer = styled.div`
	height: fit-content;
	padding: 0 0 0 5px;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.warning};
	}
`;