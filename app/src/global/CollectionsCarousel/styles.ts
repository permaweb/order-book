import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div``;

export const CardLoader = styled.div`
	height: 500px;
	width: 100%;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
`;
