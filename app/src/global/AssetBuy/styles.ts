import styled from 'styled-components';

export const Wrapper = styled.div``;

export const DCWrapper = styled.div`
	margin: 12.5px 0 0 0;
	padding: 12.5px 0 0 0;
	width: fit-content;
	border-top: 1px solid ${(props) => props.theme.colors.border.primary};
	> * {
		&:not(:last-child) {
			margin: 0 0 10px 0;
		}
		&:last-child {
			margin: 0;
		}
	}
`;

export const DCLine = styled.div`
	display: flex;
	align-items: center;
`;

export const DCLineHeader = styled.p`
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const DCLineDetail = styled.p`
	margin: 0 0 0 5px;
	font-size: ${(props) => props.theme.typography.size.small};
	line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
	font-family: ${(props) => props.theme.typography.family.primary};
	font-weight: ${(props) => props.theme.typography.weight.bold};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const SpendWrapper = styled.div`
	margin: 40px 0 0 0;
`;

export const SpendInfoWrapper = styled.div`
	margin: 20px 0 0 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const PriceInfoWrapper = styled(SpendInfoWrapper)`
	margin: 40px 0 0 0;
	flex-wrap: wrap;
	gap: 15px;
`;

export const Warning = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.warning};
	}
`;

export const TWarning = styled(Warning)`
	margin: 20px 0 0 0;
`;

export const SpendInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		margin: 12.5px 0 0 0;
		font-size: ${(props) => props.theme.typography.size.lg};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt8};
	}
`;

export const Price = styled.div`
	display: flex;
	align-items: center;
	margin: 12.5px 0 0 0;
	p {
		margin: 0;
	}
	svg {
		margin: 0 0 0 15px;
	}
`;

export const BuyAction = styled.div`
	margin: 40px 0 0 0;
	button {
		span {
			width: fit-content;
			font-family: ${(props) => props.theme.typography.family.alt1};
			font-size: ${(props) => props.theme.typography.size.lg};
			font-weight: ${(props) => props.theme.typography.weight.bold};
		}
		svg {
			height: 25px;
			width: 30px;
		}
	}
`;

export const BuyActionEnd = styled.div`
	width: fit-content;
	margin: 0 0 0 auto;	
`;

export const MaxQty = styled.div`
	width: fit-content;
	margin: 20px 0 0 auto;
`;

export const ModalTitle = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.lg};
		line-height: calc(${(props) => props.theme.typography.size.lg} + 6px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt8};
	}
`;

export const WalletConnectionWrapper = styled.div`
	width: fit-content;
	margin: 20px 0 0 auto;
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		text-align: right;
	}
	button {
		margin: 20px 0 0 auto;
		span {
			color: ${(props) => props.theme.colors.font.primary.alt1};
		}
	}
`;
