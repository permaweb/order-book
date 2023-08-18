import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	> * {
		&:not(:last-child) {
			margin: 0 10px 0 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const Action = styled.div`
	height: 100%;
	button {
		svg {
			height: 15px;
			width: 15px;
		}
	}
`;
