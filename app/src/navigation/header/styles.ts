import styled from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.header`
	height: ${STYLING.dimensions.navHeight};
	width: 100%;
	position: relative;
	top: 0;
	z-index: 5;
	background: ${(props) => props.theme.colors.navigation.header.background};
`;

export const NavWrapper = styled.div`
	height: calc(100% - 45px);
	width: 100%;
	max-width: ${STYLING.cutoffs.max};
	padding: 0 20px;
	display: flex;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin: auto;
`;

export const NavContainer = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	background: ${(props) => props.theme.colors.navigation.header.backgroundNav};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	box-shadow: 0 0 2.5px ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
`;

export const NavPaths = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		height: auto;
		display: block;
	}
`;

export const SettingsWrapper = styled.div`
	@media (max-width: ${STYLING.cutoffs.initial}) {
		margin: 0 20px 0 auto;
	}
`;

export const Link = styled.div`
	a {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20px;
		font-weight: ${(props) => props.theme.typography.weight.extraLight};
		&:hover {
			text-decoration: none;
			color: ${(props) => props.theme.colors.font.primary.active.hover};
		}
		&:focus {
			text-decoration: none;
			color: ${(props) => props.theme.colors.font.primary.active.hover};
		}
		@media (max-width: ${STYLING.cutoffs.initial}) {
			height: 60px;
			width: 100vw;
			justify-content: left;
			padding: 0 20px;
			&:hover {
				text-decoration: none;
				background: ${(props) => props.theme.colors.container.primary.hover};
			}
		}
	}
`;

export const LogoContainer = styled.div`
	position: absolute;
	left: 0;
	height: 100%;
	margin: 0 0 0 20px;
	display: flex;
	align-items: center;
	a {
		&:hover {
			text-decoration: none;
			opacity: 0.85;
		}
		&:focus {
			text-decoration: none;
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		left: auto;
		width: auto;
	}
`;

export const LogoLink = styled.a`
	height: 100%;
`;

export const LogoContent = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	svg {
		width: 143px;
	}
`;

export const NC = styled.div`
	height: 100%;
	width: fit-content;
	max-width: 77.5vw;
	right: 0;
	position: absolute;
	display: flex;
	align-items: center;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
		width: auto;
		max-width: none;
	}
`;

export const SC = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		position: relative;
		right: auto;
		height: auto;
		flex-direction: column;
		align-items: start;
	}
`;

export const Connect = styled.div<{ show: boolean }>`
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 20px 0 17.5px;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		display: ${(props) => (props.show ? 'block' : 'none')};
		height: auto;
		margin-top: 25px;
		flex-direction: column;
		align-items: start;
	}
`;

export const NCMobile = styled(NC)`
	flex-direction: column;
`;

export const Menu = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin-top: 2.5px;
	padding: 0 3.5px 0 0;
`;

export const OpenContainer = styled.div`
	position: absolute;
	height: calc(100vh - ${STYLING.dimensions.navHeight});
	overflow: auto;
	width: 100vw;
	z-index: 4;
	padding: 0 20px;
	margin: ${STYLING.dimensions.navHeight} 0 0 0;
	background: ${(props) => props.theme.colors.navigation.header.background};
	animation: ${open} ${fadeIn1};
`;

export const MenuContainer = styled.div`
	height: 100%;
	width: 50px;
	z-index: 5;
	position: relative;
`;

export const SearchWrapper = styled.div`
	width: 600px;
	max-width: 50%;
	position: absolute;
	width: 600px;
	max-width: 35%;
	position: absolute;
	left: 205px;

	@media (max-width: ${STYLING.cutoffs.initial}) {
		height: 100%;
		width: fit-content;
		left: auto;
		right: 50px;
		display: flex;
		align-items: center;
		padding: 5px 0 0 0;
	}
`;
