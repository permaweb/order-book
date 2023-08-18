import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Content = styled.div`
	height: 100%;
	width: 100%;
	max-width: ${STYLING.cutoffs.max};
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: ${open} ${fadeIn2};
`;

export const Header = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin: 0 0 20px 0;
	p {
		font-size: 20px;
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		flex-direction: column;
	}
`;

export const Action = styled.div`
	margin: 0 100px 0 auto;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		width: fit-content;
		margin: 20px 0 0 0;
	}
`;

export const Body = styled.div`
	width: 100%;
	.carousel-root {
		height: 100%;
	}
	.carousel.carousel-slider {
		overflow: visible;
		height: 100%;
	}
	.carousel .slider-wrapper {
		height: 100%;
	}
	.control-dots {
		top: -31.5px;
		right: 0;
		height: fit-content;
		width: fit-content;
		margin: 0;
		text-align: left;
		display: flex;
	}
	.slider {
		height: 100%;
	}
	li {
		height: auto !important;
		padding: 0 !important;
		&:hover {
			cursor: default;
			background: transparent !important;
		}
	}
`;

export const Indicator = styled.button<{ selected: boolean }>`
    height: 15px;
    width: 15px;
    margin: 0 3.5px !important;
    border-radius: 50%;
    background ${(props) =>
			props.selected ? props.theme.colors.indicator.active.base : props.theme.colors.indicator.inactive.base};
    &:hover {
        background ${(props) =>
					props.selected ? props.theme.colors.indicator.active.hover : props.theme.colors.indicator.inactive.hover};
    }
`;

export const NextAction = styled.div`
	position: absolute;
	top: -58.5px;
	right: 0;
	height: fit-content;
	width: fit-content;
	margin: 0;
	text-align: left;
	display: flex;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		top: -106.5px;
	}
`;

export const PrevAction = styled(NextAction)`
	right: 35px;
`;
