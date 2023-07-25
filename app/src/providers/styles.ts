import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const WalletListContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

export const WalletListItem = styled.button`
	height: 55px;
	width: 100%;
	text-align: left;
	padding: 0 20px;
	margin: 20px 0 0 0;
	display: flex;
	align-items: center;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
	}
	img {
		width: 30px;
		margin: 0 15px 0 0;
	}
	span {
		font-size: ${(props) => props.theme.typography.size.small};
		margin-top: 2.5px;
	}
`;
