import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div<{ isView: boolean }>`
	width: ${(props) => (props.isView ? 'calc(100% - 300px)' : '100%')};
	padding: ${(props) => (props.isView ? '0 0 0 30px' : '0')};
	animation: ${open} ${fadeIn2};
	margin: 0 0 0 auto;

	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		padding: 0;
		margin: 0;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-size: clamp(32px, 3.75vw, 44px) !important;
		font-weight: ${(props) => props.theme.typography.weight.bold} !important;
		font-family: ${(props) => props.theme.typography.family.primary} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
		margin: 0 0 20px 0;
		line-height: 1.5 !important;
	}

	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 50px 0px 10px 0;
	}

	h2 {
		font-size: clamp(22px, 3.05vw, 34px) !important;
		scroll-margin-top: 100px;
		a {
			font-size: clamp(22px, 3.05vw, 34px) !important;
		}
	}
	h3 {
		font-size: clamp(18px, 2.05vw, 24px) !important;
	}
	h4 {
		margin: 20px 0 10px 0;
	}
	h4,
	h5,
	h6 {
		font-size: clamp(13px, 1.95vw, 18px) !important;
	}

	strong,
	b {
		font-weight: ${(props) => props.theme.typography.weight.medium} !important;
	}

	p,
	span,
	li,
	div,
	pre {
		font-size: ${(props) => props.theme.typography.size.base} !important;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		font-family: ${(props) => props.theme.typography.family.primary} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
		line-height: 1.75 !important;
		margin: 20px 0;
	}

	a {
		font-size: ${(props) => props.theme.typography.size.base} !important;
	}

	ul {
		li {
			list-style-type: none;
			padding-left: 1em;
			position: relative;

			&::before {
				content: '\u2022';
				position: absolute;
				left: 0;
				text-align: center;
			}
		}
	}

	ol {
		counter-reset: my-counter;
		li {
			list-style-type: none;
			padding-left: 1em;
			position: relative;

			&::before {
				counter-increment: my-counter;
				content: counter(my-counter) '. ';
				position: absolute;
				left: 0;
				text-align: center;
			}
		}
	}

	a {
		text-decoration: underline;
		text-decoration-thickness: 1.65px;
		color: ${(props) => props.theme.colors.font.primary.alt4};
		&:hover {
			color: ${(props) => props.theme.colors.font.primary.alt8};
		}
	}

	code {
		padding: 2.5px 10px !important;
		background: ${(props) => props.theme.colors.container.alt3.background} !important;
		border: 1px solid ${(props) => props.theme.colors.border.primary} !important;
		border-radius: ${STYLING.dimensions.borderRadiusWrapper} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		font-size: ${(props) => props.theme.typography.size.small} !important;
	}

	pre {
		padding: 10px !important;
		background: ${(props) => props.theme.colors.container.alt3.background} !important;
		border: 1px solid ${(props) => props.theme.colors.border.primary} !important;
		border-radius: ${STYLING.dimensions.borderRadiusWrapper} !important;
		overflow: auto;
		code {
			padding: 0 !important;
			background: ${(props) => props.theme.colors.transparent} !important;
			border: 1px solid ${(props) => props.theme.colors.transparent} !important;
			color: ${(props) => props.theme.colors.font.primary.alt1} !important;
			font-weight: ${(props) => props.theme.typography.weight.regular} !important;
			font-size: ${(props) => props.theme.typography.size.small} !important;
			border-radius: 0 !important;
			line-height: 1.5 !important;
		}
	}

	img {
		width: 100%;
		background: ${(props) => props.theme.colors.container.primary.background};
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusWrapper};
		box-shadow: 0 0 2.5px ${(props) => props.theme.colors.shadow.primary};
	}
`;

export const CodeBlock = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;
	margin: 0 !important;

	pre,
	code {
		padding: 0 !important;
		margin: 0 !important;
		background: ${(props) => props.theme.colors.transparent} !important;
		border: 1px solid ${(props) => props.theme.colors.transparent} !important;
		color: ${(props) => props.theme.colors.font.primary.alt1} !important;
		font-weight: ${(props) => props.theme.typography.weight.regular} !important;
		font-size: ${(props) => props.theme.typography.size.small} !important;
		border-radius: 0 !important;
		line-height: 1.5 !important;
	}

	div {
		margin: 0 !important;
	}

	button {
		margin: 1.5px 0 0 10px !important;
	}
`;
