import styled from 'styled-components';

export const Wrapper = styled.div`
	button {
		color: ${(props) => props.theme.colors.button.warning.color};
		&:hover {
			color: ${(props) => props.theme.colors.button.warning.hover};
		}
	}
`;

export const FlexActions = styled.div`
	display: flex;
	align-items: center;
	margin: 40px 0 0 0;
	button {
		margin: 0 20px 0 0;
	}
`;
