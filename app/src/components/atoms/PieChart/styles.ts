import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	margin: -80px 0 -50px auto;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: auto;
	}
`;
