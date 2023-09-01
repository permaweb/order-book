import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: 100%;
	padding: 20px;
`;

export const Header = styled.div`
	margin: 0 0 30px 0;
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
		background: ${(props) => props.theme.colors.container.alt2.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
`;

export const ChartKeyWrapper = styled.div`
	display: flex;
	align-items: center;
	margin: 0 0 20px 0;
	> * {
		&:not(:last-child) {
			margin: 0 10px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const ChartKeyLine = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;

export const ChartKey = styled.div<{ background: string }>`
	height: 20px;
	width: 20px;
	background: ${(props) => props.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 2.5px;
	margin: 0 10px 0 0;
`;

export const ChartWrapper = styled.div`
	width: 100%;
`;

export const LoadingWrapper = styled.div`
	margin: 10px 0 20px 0 !important;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 30px 0 20px 0 !important;
	}
`;
