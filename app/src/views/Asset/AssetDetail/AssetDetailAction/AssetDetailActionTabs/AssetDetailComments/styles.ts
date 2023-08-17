import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	padding: 20px;
	position: relative;
	overflow: auto;
`;

export const CommentsWrapper = styled.div`
	margin: 20px 0 0 0;
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const CommentLine = styled.div`
	width: 100%;
	padding: 20px 0 0 0;
	border-top: 1px solid ${(props) => props.theme.colors.border.alt5};
`;

export const CommentHeader = styled.div`
	margin: 0 0 5px 0;
	display: flex;
	justify-content: space-between;
`;

export const ActionsContainer = styled.div`
	margin: 27.5px 0 0 0;
	display: flex;
	align-items: center;
`;

export const Action = styled.div`
	margin: 0 0 0 10px;
`;

export const CommentDivider = styled.div`
	padding: 5px 0 0 0;
	margin: 0 7.5px;
	display: flex;
`;

export const CommentDetail = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 10px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;

export const LoadingWrapper = styled.div`
	margin: 20px 0 0 0;
	width: fit-content;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

export const CommentCreateWrapper = styled.div`
	width: 100%;
	margin: 0 !important;
`;

export const CommentCreate = styled.div``;

export const CommentCreateForm = styled.form``;

export const CommentCreateTextArea = styled.textarea<{ invalid: boolean }>`
	resize: none;
	height: auto;
	width: 100%;
	color: ${(props) => props.theme.colors.font.primary.alt1};
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 10px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	padding: 0;
	margin: 10px 0 0 0;
	border: none;
`;

export const CommentCreateSubmit = styled.div`
	width: fit-content;
	margin: 20px 0 0 auto;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 20px 0 0 auto;
	}
`;

export const WalletConnectionWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 100px 0;
	flex-wrap: wrap;
	gap: 20px;
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		padding: 7.5px 20px;
		background: ${(props) => props.theme.colors.container.alt2.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
	button {
		width: fit-content;
		span {
			color: ${(props) => props.theme.colors.font.primary.alt1};
			background: transparent;
			border: none;
			border-radius: 0;
			padding: 0;
			font-weight: inherit;
		}
	}
`;

export const WalletConnect = styled.div`
	width: fit-content;
`;

export const ActionContainer = styled.div`
	height: 42.5px;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	button {
		margin: 0 auto;
	}
`;
