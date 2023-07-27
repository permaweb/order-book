import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const AvatarWrapper = styled.div`
	height: 150px;
	width: 150px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1.5px solid ${(props) => props.theme.colors.border.primary};
	border-radius: 50%;
	svg {
		height: 75px;
		width: 75px;
		stroke: ${(props) => props.theme.colors.icon.alt1.fill};
	}
`;

export const Avatar = styled.img`
	height: 100%;
	width: 100%;
	border-radius: 50%;
`;

export const ArLogo = styled.div`
	height: 35px;
	width: 35px;
	margin: 25px 0;
	svg {
		height: 100%;
		width: 100%;
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.lg};
		line-height: calc(${(props) => props.theme.typography.size.lg} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		text-align: center;
	}
`;

export const SubHeader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 25px 0 0 0;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt6};
		text-align: center;
	}
`;

export const Action = styled.div`
	margin: 25px 0 0 0;
`;
