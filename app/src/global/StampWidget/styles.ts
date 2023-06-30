import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 40px;
	width: 80px;
	background: ${(props) => props.theme.colors.container.alt5.background};
	border-radius: ${STYLING.dimensions.borderRadius};
	display: flex;
	align-items: center;
	padding: 0 10px;
	cursor: pointer;
	p {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		font-family: ${(props) => props.theme.typography.family.alt1} !important;
		color: ${(props) => props.theme.colors.font.primary.base} !important;
	}
	.s-divider {
		margin: 0 10px;
		height: 65%;
		width: 2px;
		border-left: 2px solid ${(props) => props.theme.colors.border.alt3};
	}
	svg {
		height: 30px !important;
		width: 25px !important;
	}
`;

export const ButtonWrapper = styled.div``;

export const NotifWrapper = styled.div``;

export const SAContainer = styled.div`
	min-height: 100px;
	width: 300px;
	max-width: 55vw;
	padding: 20px;
	position: absolute;
	z-index: 2;
	top: -13.5px;
	right: 65%;
	display: flex;
	flex-direction: column;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	background: ${(props) => props.theme.colors.container.primary.background};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	&:after {
		content: ' ';
		position: absolute;
		top: 37.5px;
		left: 100%;
		border-width: 5px;
		border-style: solid;
		border-color: ${(props) => props.theme.colors.transparent} ${(props) => props.theme.colors.transparent}
			${(props) => props.theme.colors.transparent} ${(props) => props.theme.colors.border.primary};
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		right: 0;
		top: 58.5px;
		&:after {
			content: ' ';
			position: absolute;
			top: -10px;
			left: 50%;
			border-width: 5px;
			border-style: solid;
			border-color: ${(props) => props.theme.colors.transparent} ${(props) => props.theme.colors.transparent}
				${(props) => props.theme.colors.border.primary} ${(props) => props.theme.colors.transparent};
		}
	}
`;

export const SAInfoContainer = styled.div`
	height: 30px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const SABalanceContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 7.5px 12.5px !important;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	background: ${(props) => props.theme.colors.container.alt4.background};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	svg {
		fill: ${(props) => props.theme.colors.font.primary.active.base} !important;
		width: 12.5px !important;
		margin: 2.5px 10px 0 0 !important;
	}
	p {
		max-width: 85%;
		font-family: ${(props) => props.theme.typography.family.primary} !important;
		font-size: ${(props) => props.theme.typography.size.xSmall} !important;
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
		color: ${(props) => props.theme.colors.font.primary.active.base} !important;
		overflow: hidden;
		text-overflow: ellipsis;
		height: auto !important;
		margin: 0 !important;
	}
`;

export const SACloseContainer = styled.div``;

export const SAFormContainer = styled.form`
	height: calc(100% - 30px);
	width: 100%;
`;

export const SAInput = styled.div`
	width: 100%;
`;

export const SASubmit = styled.div`
	width: 100%;
	display: flex;
	justify-content: end;
	align-items: center;
	button {
		margin: 0 !important;
	}
`;
