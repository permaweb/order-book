import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.button`
	height: 37.5px;
	width: fit-content;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	padding: 6.5px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
	&:disabled {
		background: ${(props) => props.theme.colors.button.primary.disabled.background};
		cursor: default;
	}
	p {
		margin: 0 12.5px 0 0;
		font-size: ${(props) => props.theme.typography.size.small} !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		font-family: ${(props) => props.theme.typography.family.alt1} !important;
		color: ${(props) => props.theme.colors.font.primary.alt8} !important;
	}
	svg {
		margin: 2.5px 0 0 0;
		height: 20px !important;
		width: 20px !important;
	}
`;

export const DetailLine = styled.div`
	display: flex;
	align-items: center;
	margin: 0 0 10px 0;
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		margin: 0 0 0 5px;
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.alt1};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;

export const FlexActions = styled.div`
	display: flex;
	align-items: center;
	margin: 20px 0 0 0;
	flex-wrap: wrap;
    gap: 20px;
	button {
		margin: 0 20px 0 0;
	}
`;

export const SAContainer = styled.div`
	min-height: 100px;
	margin: 20px 0 0 0;
	width: 100%;
	max-width: 55vw;
	display: flex;
	flex-direction: column;
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
	width: 350px;
	max-width: 100%;
`;

export const SAActions = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	> * {
		&:not(:last-child) {
			margin: 0 20px 0 0 !important;
		}
		&:last-child {
			margin: 0 !important;
		}
	}
`;

export const Message = styled.div<{ loading: 'true' | 'false' }>`
	margin: 20px 0 0 auto;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => (props.loading === 'true') ? props.theme.colors.font.primary.alt1 : props.theme.colors.font.primary.alt2};
	}
`;