import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	padding: 20px;
	position: relative;
	> * {
		&:not(:last-child) {
			margin: 0 0 25px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const CommentLine = styled.div`
	width: 100%;
`;

export const CommentHeader = styled.div`
	margin: 0 0 5px 0;
	display: flex;
	justify-content: space-between;
`;

export const StampWidget = styled.div`
	margin: 0 20px 0 0;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 0;
	}
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
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;

export const LoadingContainer = styled.div`
	width: fit-content;
	margin: 0 auto !important;
`;

export const CommentCreateWrapper = styled.div`
	width: 100%;
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
	font-weight: ${(props) => props.theme.typography.weight.regular};
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
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	button {
		width: fit-content;
		span {
			color: ${(props) => props.theme.colors.font.primary.alt1};
		}
	}
`;

export const WalletConnect = styled.div`
	width: fit-content;
`;
