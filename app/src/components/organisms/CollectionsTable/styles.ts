import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	scroll-margin-top: 20px;
`;

export const Header = styled.div`
	width: 100%;
	margin: 0 0 40px 0;
	p {
		font-size: 20px;
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const Body = styled.div``;

export const HSection1 = styled.div`
	width: 100%;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	display: flex;
	align-items: center;
	padding: 0 20px 10px 20px;
	margin: 0 0 20px 0;
	p,
	a {
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt6};
	}
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
	}
`;

export const Rank = styled.div`
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		display: none;
	}
`;

export const Collection = styled.div`
	min-width: 110px;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 0;
	}
`;

export const SHeaderFlex = styled.div`
	display: flex;
	align-items: center;
	margin: 0 0 0 auto;
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		display: none;
	}
`;

export const StampCount = styled.div``;

export const PICWrapper = styled.div`
	width: 100%;
	margin: 0 0 20px 0;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
	}
`;

export const PCWrapper = styled.div`
	min-height: 125px;
	width: 100%;
	animation: ${open} ${fadeIn2};
	position: relative;
	background: ${(props) => props.theme.colors.container.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	position: relative;
	transition: background 0.1s;
	p,
	a {
		max-width: none;
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 2px);
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		height: auto;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const PCLoader = styled(PCWrapper)`
	height: 125px;
	padding: 0;
	overflow: hidden;
	&:hover {
		cursor: default;
	}
`;

export const AFlex = styled.div`
	display: flex;
	align-items: center;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		margin: 0 0 20px 0;
	}
`;

export const ATitle = styled.div`
	max-width: 260px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: flex;
	align-items: center;
	p,
	a {
		width: fit-content;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		width: 165px;
		p,
		a {
			width: 100%;
			max-width: none;
		}
	}
`;

export const AWrapper = styled.div`
	position: relative;
`;

export const ThumbnailWrapper = styled.div`
	min-height: 85px;
	min-width: 85px;
	height: 85px;
	width: 85px;
	background: ${(props) => props.theme.colors.container.primary.background};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	margin: 0 15px 0 0;
	overflow: hidden;
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
`;

export const CollectionLink = styled(ThumbnailWrapper)`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	background: ${(props) => props.theme.colors.semiTransparentAlt3};
	opacity: 0;
	transition: ease 200ms;
	&:hover {
		opacity: 1;
	}
	a {
		display: block;
		height: 100%;
		width: 100%;
	}
`;

export const SFlex = styled.div`
	display: flex;
	align-items: center;
	@media (max-width: calc(${STYLING.cutoffs.initialWrapper} + 50px)) {
		width: 100%;
		justify-content: space-between;
	}
`;

export const AOrders = styled.div`
	min-width: 100px;
	margin: 0 20px 0 0;
`;

export const SCValue = styled.div``;

export const PWrapper = styled.div`
	width: 100%;
	margin: 20px 0;
`;
