import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Container = styled.div`
	height: fit-content;
	margin: auto 0 0 0;
	position: relative;
`;

export const List = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
`;

export const Content = styled.div`
	height: calc(100% - 25px);
	position: relative;
`;

export const Tab = styled.div``;

export const AltTab = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
`;

export const AltTabAction = styled.button<{ active: boolean; icon: boolean }>`
	padding: ${(props) => (props.icon ? '8.15px 25px 8.15px 22.5px' : '8.15px 25px')};
	font-size: ${(props) => props.theme.typography.size.small};
	font-weight: ${(props) => props.theme.typography.weight.regular};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	color: ${(props) => props.theme.colors.font.primary.alt1};
	cursor: pointer;
	background: ${(props) =>
		props.active ? props.theme.colors.button.primary.active.background : props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	&:hover {
		background: ${(props) => props.theme.colors.button.primary.hover};
	}

	display: flex;
	justify-content: center;
	align-items: center;

	&:after {
		display: block;
		content: '';
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: -10px;
		background: ${(props) => (props.active ? props.theme.colors.tabs.active : props.theme.colors.transparent)};
		height: 2px;
		width: 100%;
	}
`;

export const Icon = styled.div`
	svg {
		height: 17.5px;
		width: 17.5px;
		padding: 3.5px 0 0 0;
		margin: 0 12.5px 0 0;
		fill: ${(props) => props.theme.colors.button.primary.label};
	}
`;
