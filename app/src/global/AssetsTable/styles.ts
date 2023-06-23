import styled from 'styled-components';

export const Wrapper = styled.div`
	h2 {
		margin: 0 0 40px 0;
	}
`;

export const NoAssetsContainer = styled.div`
	height: fit-content;
	p {
		color: ${(props) => props.theme.colors.warning};
	}
`;
