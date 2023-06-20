import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.main`
	min-height: calc(100vh - ${STYLING.dimensions.navHeight});
	width: 100%;
	margin: 0 auto;
	position: relative;
`;
