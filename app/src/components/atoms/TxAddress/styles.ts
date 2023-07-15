import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	align-items: center;
	p {
		font-size: ${(props) => props.theme.typography.size.small};
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.light};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	svg {
		height: 12.5px;
		width: 12.5px;
		margin: 4.5px 0 0 10px;
	}
`;

export const Details = styled.div`
	margin: 0 0 0 5px;
	svg {
		height: 15.5px !important;
		width: 17.5px !important;
		margin: 4.5px 0 0 10px !important;
	}
`;

export const TxData = styled.div`
	pre {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		font-weight: ${(props) => props.theme.typography.weight.regular};
		color: ${(props) => props.theme.colors.font.primary.alt8};
		line-height: 1.5;
	}
`;
