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
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	overflow: hidden;
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

export const DrawerContent = styled.div<{ transparent?: boolean }>`
	width: 100%;
	padding: ${(props) => (props.transparent ? `0` : `20px`)};
	background: ${(props) =>
		props.transparent ? props.theme.colors.transparent : props.theme.colors.container.alt2.background};
	border-bottom-left-radius: ${(props) => (props.transparent ? `0` : STYLING.dimensions.borderRadiusField)};
	border-bottom-right-radius: ${(props) => (props.transparent ? `0` : STYLING.dimensions.borderRadiusField)};
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const DrawerHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	padding: 0 0 7.5px 0;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		word-wrap: break-word;
	}
`;

export const DrawerHeaderFlex = styled.div`
	display: flex;
	justify-content: space-between;
	width: 190px;
	max-width: 57.5%;
	align-items: center;
`;

export const DCHeader = styled.p`
	font-size: ${(props) => props.theme.typography.size.base};
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	line-height: 1.65;
	word-wrap: break-word;
`;

export const DCLine = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
`;

export const DCLineHeader = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	word-wrap: break-word;
`;

export const DCLineDetail = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	word-wrap: break-word;
`;

export const DCLineDetailMedium = styled(DCLineDetail)`
	font-weight: ${(props) => props.theme.typography.weight.medium};
`;

export const DCSalePercentage = styled(DCLineDetail)`
	margin: 0 0 0 0.5px;
`;

export const DCLineFlex = styled.div`
	display: flex;
	justify-content: space-between;
	width: 190px;
	max-width: 57.5%;
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

export const ACHeader = styled(AssetCDetail)`
	padding: 20px;
	h2 {
		line-height: 1.5;
		margin: 0 0 20px 0;
	}
`;

export const StampWidget = styled.div`
	margin: 0 0 20px 0;
`;

export const OwnerLine = styled.div`
	margin: 10px 0 0 0;
	display: flex;
	align-items: center;
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	button {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.button.primary.background};
		text-decoration: underline;
		margin: 0 0 0 5px;
		&:hover {
			color: ${(props) => props.theme.colors.button.primary.hover};
		}
	}
`;

export const AssetCAction = styled.div`
	width: 100%;
	padding: 20px;
`;

export const Warning = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.warning};
	}
	button {
		margin: 20px 0 0 0;
	}
`;