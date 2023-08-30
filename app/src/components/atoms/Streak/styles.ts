import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.button`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 15px;
	margin: 0 0 0 10px;
	background: ${(props) => props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	img {
		height: 17.5px;
		width: 17.5px;
		margin: 0 7.5px 0 0;
	}
	&:hover {
		background: ${(props) => props.theme.colors.button.primary.hover};
	}
`;

export const WrapperTemp = styled.div`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 15px;
	margin: 0 0 0 10px;
	background: ${(props) => props.theme.colors.button.primary.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
	p {
		color: ${(props) => props.theme.colors.font.primary.alt8};
		font-size: ${(props) => props.theme.typography.size.small};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	img {
		height: 17.5px;
		width: 17.5px;
		margin: 0 7.5px 0 0;
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
	width: 45%;
	@media (max-width: ${STYLING.cutoffs.initial}) {
		width: 100%;
		margin: 40px 0 0 0;
	}
`;

export const M2Header = styled(MHeader)`
	padding: 0;
`;

export const M2Body = styled.div`
	margin: 20px 0 0 0;
	padding: 15px;
	max-height: 450px;
	overflow-y: auto;
	scrollbar-width: none;
	::-webkit-scrollbar {
		width: 0px;
	}
	> * {
		&:not(:last-child) {
			margin: 0 0 20px 0;
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
	margin: 0 7.5px 0 0;
`;

export const MDetailFlex = styled.div`
	display: flex;
	align-items: center;
`;
