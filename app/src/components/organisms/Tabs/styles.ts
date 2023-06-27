import styled from 'styled-components';

export const Container = styled.div`
	height: fit-content;
	margin: auto 0 0 0;
`;

export const List = styled.div`
	display: flex;
	border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

export const Content = styled.div`
	height: calc(100% - 25px);
	position: relative;
`;

export const Tab = styled.div`
	margin: 0 15px 0 0;
`;
