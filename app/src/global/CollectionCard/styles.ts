import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 450px;
	width: 100%;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	overflow: hidden;
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		height: auto;
	}
`;

export const CollectionCard = styled.div`
	height: 100%;
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background};
	display: flex;
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		height: auto;
		flex-direction: column-reverse;
	}
`;

export const InfoWrapper = styled.div`
	height: 100%;
	width: calc(100% - 800px);
	padding: 110px 30px;
	h2,
	p {
		text-align: left;
	}
	h2 {
		line-height: 1.5;
		font-weight: ${(props) => props.theme.typography.weight.light};
	}
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		height: auto;
		width: 100%;
		padding: 40px 20px;
	}
`;

export const ButtonWrapper = styled.div`
    margin: 20px 0 0 0;
`;

export const StampWidget = styled.div`
	margin: 20px 0 0 0;
`;

export const ImageWrapper = styled.div<{ backgroundImage: string }>`
	height: 100%;
	width: 800px;
	background-image: url(${(props) => props.backgroundImage});
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	border-radius: ${STYLING.dimensions.borderRadius};
	@media (max-width: ${STYLING.cutoffs.initialWrapper}) {
		height: 450px;
		width: 100%;
	}
`;
