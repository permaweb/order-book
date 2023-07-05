import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	margin: 0 0 -100px 0;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: auto;
	}
`;
