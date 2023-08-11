import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const NWrapper = styled.div`
	height: auto;
	width: 300px;
	backdrop-filter: blur(2px);
	animation: ${open} ${fadeIn2};
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 0 0 20px 0;
		position: relative;
	}
`;

export const NContent = styled.div`
	max-height: 700px;
	width: 100%;
	overflow: auto;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	box-shadow: 0 0 2.5px ${(props) => props.theme.colors.shadow.primary};
	padding: 20px 20px 10px 20px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		padding: 0;
		max-height: none;
	}
`;

export const NTitle = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 0 0 20px 0;
	p {
		font-size: 22px !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
	}
`;

export const NTitleMobile = styled.button`
	height: 50px;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 0 15px;
	&:hover {
		cursor: pointer;
	}

	&:focus {
		outline: 0;
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		height: 40px;
	}
	-webkit-appearance: none !important;
	-moz-appearance: none !important;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAMAAACtdX32AAAAdVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhMdQaAAAAJ3RSTlMAAAECAwQGBwsOFBwkJTg5RUZ4eYCHkJefpaytrsXGy8zW3+Do8vNn0bsyAAAAYElEQVR42tXROwJDQAAA0Ymw1p9kiT+L5P5HVEi3qJn2lcPjtIuzUIJ/rhIGy762N3XaThqMN1ZPALsZPEzG1x8LrFL77DHBnEMxBewz0fJ6LyFHTPL7xhwzWYrJ9z22AqmQBV757MHfAAAAAElFTkSuQmCC);
	background-position: 100%;
	background-repeat: no-repeat;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
	}
`;

export const NList = styled.ul`
	width: 100%;
	overflow: auto;
	a {
		text-decoration: none;
	}
	> * {
		&:last-child {
			border-bottom: none;
		}
	}
`;

export const NListItem = styled.li<{ disabled: boolean; active: boolean }>`
	pointer-events: ${(props) => (props.disabled ? 'none' : 'default')};
	text-align: left;
	cursor: pointer;
	line-height: 1.5;
	font-size: ${(props) => props.theme.typography.size.small};
	color: ${(props) => (props.active ? props.theme.colors.font.primary.alt1 : props.theme.colors.font.primary.alt1)};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	padding: 10px 15px;
	margin: 0 0 7.5px 0;
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.transparent};
	border: 1px solid ${(props) => (props.active ? props.theme.colors.border.primary : 'transparent')};
	&:hover {
		background: ${(props) =>
			props.disabled ? props.theme.colors.button.primary.disabled.background : props.theme.colors.button.primary.hover};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: 15px;
	}
`;

export const NSubHeader = styled(NTitle)`
	height: auto;
	justify-content: flex-start;
	font-size: ${(props) => props.theme.typography.size.small};
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	padding: 10px 15px;
	margin: 0 0 7.5px 0;
	p {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
	}
`;

export const NSubList = styled.div`
	padding: 0 0 0 20px;
`;
