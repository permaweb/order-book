import styled from 'styled-components';

export const Wrapper = styled.div`
	position: relative;
	padding: 20px;
	> * {
		&:not(:last-child) {
			margin: 0 0 25px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const TabWrapper = styled.div<{ label: string; icon?: string }>``;

export const TabContent = styled.div`
	margin: 18.5px 0 0 0;
`;
