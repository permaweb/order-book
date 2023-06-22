import styled from 'styled-components';


export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	overflow: hidden;
`;

export const Frame = styled.iframe`
	height: 100%;
	width: 100%;
	scrollbar-width: none;
`;

export const FrameLoader = styled.button`
    height: 100%;
    width: 100%;
	svg {
		height: 100px;
		width: 100px;
	}
	background: ${(props) => props.theme.colors.container.primary.background};
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
		// border-top: 1px solid ${(props) => props.theme.colors.border.primary};
		// border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	}
`;

export const Image = styled.img`
	height: 100%;
	width: 100%;
	object-fit: contain;
`;

export const Preview = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		height: 57.5px;
		width: 57.5px;
	}
`;