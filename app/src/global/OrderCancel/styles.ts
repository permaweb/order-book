import styled from 'styled-components';

export const Wrapper = styled.div`
	button {
		color: ${(props) => props.theme.colors.button.warning.color};
		&:hover {
			color: ${(props) => props.theme.colors.button.warning.hover};
		}
	}
`;

export const ModalHeader = styled.div`
	p {
		margin: 20px 0 40px 0;
		line-height: 1.5;
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
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
`;
