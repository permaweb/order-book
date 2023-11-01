import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	position: relative;
`;

export const SAction = styled.button`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.button.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.button.alt2.border};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	&:hover {
		background: ${(props) => props.theme.colors.button.alt2.hover};
	}
	&:focus {
		background: ${(props) => props.theme.colors.button.alt2.hoverm};
	}
`;

export const SWrapper = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 13.5px 0 10px;
	border-right: 1px solid ${(props) => props.theme.colors.button.alt2.border};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		font-family: ${(props) => props.theme.typography.family.primary};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	img {
		height: 15px;
		width: 15px;
		margin: -1.5px 5px 0 0;
	}
`;

export const BWrapper = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 10px 0 13.5px;
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		font-family: ${(props) => props.theme.typography.family.primary};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	svg {
		height: 17.5px !important;
		width: 17.5px !important;
		margin: 2.5px 0 0 7.5px !important;
	}
`;

export const SDropdown = styled.div`
	width: 405px;
	max-width: 90vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	z-index: 1;
	right: 0;
	margin: 10px 0 0 0;
	padding: 20px;
`;

export const SDHeader = styled.div`
	margin: 0 0 20px 0;
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.lgAlt};
		font-weight: ${(props) => props.theme.typography.weight.light};
		line-height: 1.5;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const SDStreak = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 10px 0 20px 0;
	padding: 0 0 20px 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		font-family: ${(props) => props.theme.typography.family.primary};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	img {
		height: 27.5px;
		width: 27.5px;
		margin: -1.5px 5px 0 0;
	}
`;

export const SDCountdown = styled.div`
	margin: 20px 0;
	width: 100%;
	span {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.light};
		font-family: ${(props) => props.theme.typography.family.primary};
		line-height: 1.5;
	}
	p {
		color: ${(props) => props.theme.colors.font.primary.alt13};
		font-size: ${(props) => props.theme.typography.size.lg};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		font-family: ${(props) => props.theme.typography.family.primary};
		margin: 10px 0;
	}
`;

export const SDActions = styled.div`
	width: 100%;
	margin: 20px 0 0 0;
`;

export const SDActionsFlex = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 10px;
	margin: 0 0 20px 0;
`;

export const SDLink = styled.div`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.button.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.button.alt2.border};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	transition: all 250ms;
	&:hover {
		cursor: pointer;
		background: ${(props) => props.theme.colors.button.alt2.hover};
	}
	a {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 30px 0 20px;
		text-decoration: none !important;
	}
	svg {
		height: 17.5px !important;
		width: 17.5px !important;
		margin: 0 10px 0 0 !important;
	}
`;

export const SDLAction = styled.div`
	svg {
		height: 20px;
		width: 20px;
		margin: 2.5px 7.5px 0 0 !important;
	}
`;

export const MWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		flex-direction: column;
	}
`;

export const M1 = styled.div`
	width: 40%;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
	}
`;

export const MHeader = styled.div`
	padding: 15px;
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
	}
`;

export const M1Body = styled.div`
	margin: 40px 0 0 0;
	padding: 12.5px 0 0 0;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
	}
`;

export const MBodyFlex = styled.div`
	display: flex;
	align-items: center;
	margin: 0 0 10px 0;
	span,
	p {
		color: ${(props) => props.theme.colors.font.primary.alt1};
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: 1.5;
	}
	span {
		margin: 0 5px 0 0;
	}
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	img {
		height: 17.5px;
		width: 17.5px;
		margin: 0 0 0 2.5px;
		padding: 0 0 1.5px 0px;
	}
`;

export const M2 = styled.div`
	width: 100%;
`;

export const M2Header = styled(MHeader)`
	padding: 0;
`;

export const M2Body = styled.div`
	width: 100%;
	> * {
		&:not(:last-child) {
			margin: 0 0 22.5px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		max-height: none;
	}
`;

export const M2BodyFlex = styled(MBodyFlex)`
	margin: 0;
	justify-content: space-between;
`;

export const Rank = styled.p`
	width: 20px;
	margin: 0 7.5px 0 0;
`;

export const MDetailFlex = styled.div`
	display: flex;
	align-items: center;
`;

export const MDetailFlexAlt = styled(MDetailFlex)`
	p {
		font-family: ${(props) => props.theme.typography.family.primary};
	}
`;
