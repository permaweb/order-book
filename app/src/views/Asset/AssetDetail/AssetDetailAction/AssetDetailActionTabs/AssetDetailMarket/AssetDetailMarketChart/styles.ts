import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: 100%;
	padding: 20px;
	margin: 0 0 20px 0;
	position: relative;
`;

export const HeaderWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	justify-content: space-between;
	margin: 0 0 20px 0;
`;

export const Header = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: calc(${(props) => props.theme.typography.size.base} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		width: fit-content;
		max-width: 100%;
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 7.5px 20px;
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
`;

export const ChartWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap-reverse;
	gap: 40px;
`;

export const Chart = styled.div`
	height: auto;
	width: 400px;
	max-width: 100%;
`;

export const ChartKeyWrapper = styled.div`
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const ChartKeyLine = styled.div<{ first: boolean }>`
	display: flex;
	align-items: center;
	margin: ${(props) => (props.first ? '0 0 17.5px 0 !important' : '0 0 10px 0')};
	padding: ${(props) => (props.first ? `0 0 7.5px 0` : '0')};
	border-bottom: ${(props) => (props.first ? `1px solid ${props.theme.colors.border.primary}` : 'none')};
`;

export const Percentage = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	padding: 0 !important;
	border: none !important;
	margin: 0 0 0 7.5px;
`;

export const ChartKey = styled.div<{ background: string }>`
	height: 20px;
	width: 20px;
	background: ${(props) => props.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 2.5px;
	margin: 0 10px 0 0;
`;
