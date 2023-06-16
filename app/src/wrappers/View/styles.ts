import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.main`
	min-height: calc(100vh - ${STYLING.dimensions.navHeight});
	width: 100%;
	// background: ${(props) => `linear-gradient(to bottom, ${props.theme.colors.container.primary.background3}, ${props.theme.colors.container.primary.background2}, ${props.theme.colors.container.primary.background1})`};
	margin: 0 auto;
	position: relative;
`;
