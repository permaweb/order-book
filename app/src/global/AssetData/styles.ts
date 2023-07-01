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
		border-top: 1px solid ${(props) => props.theme.colors.border.primary};
		border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	}
`;

export const Image = styled.img`
	height: 100%;
	width: 100%;
	object-fit: contain;
`

export const Audio = styled.audio`
	height: 100%;
	width: 100%;
	background: ${(props) => props.theme.colors.container.alt9.background};
	padding: 20px;
`;

export const Video = styled.video`
	height: 100%;
	width: 100%;
	background: ${(props) => props.theme.colors.container.alt9.background};
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

export const UnsupportedWrapper = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	svg {
		height: 75px;
   	 	width: 75px;
		max-height: 50%;
		max-width: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
`;
