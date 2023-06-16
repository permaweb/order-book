import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
    width: 100%;
`;

export const PICWrapper = styled.div`
    width: 100%;
    margin: 0 0 20px 0;
`;

export const PCWrapper = styled.div`
	height: 125px;
	width: 100%;
	animation: ${open} ${fadeIn2};
	border-radius: ${STYLING.dimensions.borderRadius};
	position: relative;
    background: ${(props) => props.theme.colors.container.alt1.background};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const NoAssetsContainer = styled.div`
	margin: 12.5px 15px;
	height: fit-content;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;