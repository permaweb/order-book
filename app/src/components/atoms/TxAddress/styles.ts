import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	svg {
		height: 12.5px;
		width: 12.5px;
		margin: 4.5px 0 0 10px;
	}
`;
