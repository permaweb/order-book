import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

const C1_DIMENSION = '550px';

export const Wrapper = styled.div`
	width: 100%;
	display: flex;
	animation: ${open} ${fadeIn2};
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		flex-direction: column;
	}
`;

export const C1Wrapper = styled.div`
	width: ${C1_DIMENSION};
	max-width: 100%;
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		width: 100%;
	}
`;

export const C1 = styled.div`
	width: ${C1_DIMENSION};
	max-width: 100%;
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		width: 100%;
	}
`;

export const AssetWrapper = styled.div`
	height: ${C1_DIMENSION};
	width: 100%;
	background: ${(props) => props.theme.colors.container.alt3.background};
	border-radius: ${STYLING.dimensions.borderRadius};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const AssetInfoWrapper = styled.div`
	width: ${C1_DIMENSION};
	max-width: 100%;
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		width: 100%;
	}
`;

export const DrawerWrapper = styled.div`
	width: 100%;
	margin: 20px 0 0 0;
`;

export const DrawerContent = styled.div`
	width: 100%;
	padding: 20px;
	background: ${(props) => props.theme.colors.container.alt2.background};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadiusField};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadiusField};
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const DCHeader = styled.p`
	font-size: ${(props) => props.theme.typography.size.base};
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const DCLine = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const DCLineHeader = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const DCLineDetail = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.regular};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const C2 = styled.div`
	width: calc(100% - ${C1_DIMENSION});
	padding: 0 0 0 40px;
	& > * {
		margin: 0 0 20px 0;
	}
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		width: 100%;
		padding: 0;
		margin: 20px 0 0 0;
	}
`;

export const AssetCDetail = styled.div`
	width: 100%;
	padding: 20px;
	h2 {
		font-size: ${(props) => props.theme.typography.size.lg};
	}
`;

export const ACHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const AssetCAction = styled.div`
	width: 100%;
	padding: 20px;
`;
