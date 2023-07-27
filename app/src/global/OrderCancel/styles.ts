import styled from 'styled-components';

export const Wrapper = styled.div`
	button {
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.button.warning.color};
		&:hover {
			color: ${(props) => props.theme.colors.button.warning.hover};
		}
	}
`;

export const IconWrapper = styled.div`
	button {
		width: 12.5px !important;
		margin: 1.5px 0 0 3.5px;
	}
`;

export const ModalHeader = styled.div`
	h2,
	p {
		line-height: 1.5;
	}
	p {
		margin: 20px 0 40px 0;
	}
`;

export const FlexActions = styled.div`
	display: flex;
	align-items: center;
	margin: 20px 0 0 0;
	button {
		margin: 0 20px 0 0;
	}
`;

export const Message = styled.div<{ loading: 'true' | 'false' }>`
	margin: 20px 0 0 auto;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 10px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;
