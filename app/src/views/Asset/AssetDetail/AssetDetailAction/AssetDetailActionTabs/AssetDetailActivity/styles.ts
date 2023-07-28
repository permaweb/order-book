import styled from 'styled-components';

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
