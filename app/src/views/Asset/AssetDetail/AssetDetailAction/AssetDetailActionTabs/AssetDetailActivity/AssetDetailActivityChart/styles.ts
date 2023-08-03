import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: 100%;
`;

export const Header = styled.div`
	margin: 0 0 20px 0;
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: calc(${(props) => props.theme.typography.size.base} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		width: fit-content;
		padding: 7.5px 20px;
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
`;

export const ChartWrapper = styled.div`
	width: 100%;
`;
