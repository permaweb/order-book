import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	width: 100%;
	padding: 20px;
`;

export const Header = styled.div`
	margin: 0 0 20px 0;
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: calc(${(props) => props.theme.typography.size.base} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		width: fit-content;
		padding: 7.5px 20px;
		border: 1px solid ${(props) => props.theme.colors.border.primary};
		border-radius: ${STYLING.dimensions.borderRadiusField};
	}
`;

export const TreeDiagram = styled.div`
	height: 450px;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	animation: ${open} ${fadeIn2};
`;

export const CyWrapper = styled.div`
	height: 100%;
	width: 100%;
`;

export const TxWrapper = styled.div`
	width: 100%;
	margin: 40px 0 0 0;
	display: flex;
`;

export const TInfoWrapper = styled.div`
	width: 40%;
`;

export const TTableWrapper = styled.div`
	width: 60%;
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const TRow = styled.div`
	display: flex;
	align-items: center;
`;

// export const TAssetWrapper = styled.div`
//     height: 250px;
//     width: 60%;
//     overflow: hidden;
//     border: 1px solid ${(props) => props.theme.colors.border.primary};
//     border-radius: ${STYLING.dimensions.borderRadius};
// `;

export const TFlex = styled.div`
	display: flex;
	align-items: center;
	p,
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
	span {
		margin: 0 7.5px 0 0;
	}
`;

export const THeaderWrapper = styled.div`
	width: fit-content;
	padding: 0 0 12.5px 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
`;

export const TDetailWrapper = styled.div`
	margin: 12.5px 0 0 0;
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;
