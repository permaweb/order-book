import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

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
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt1};
`;

export const Form = styled.form`
	margin: 20px 0 0 0;
`;

export const FormWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 20px;
`;

export const SliderWrapper = styled.div`
	margin: 0 0 20px 0;
`;

export const FieldFlex = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin: 20px 0 0 auto;
`;

export const FieldWrapper = styled.div`
	width: 350px;
	max-width: 50%;
	@media (max-width: ${STYLING.cutoffs.tablet}) {
		max-width: none;
	}
`;

export const MaxQty = styled.div`
	width: fit-content;
	margin: 0 0 0 auto;
`;

export const FormContainer = styled.div`
	width: 50%;
	max-width: ${STYLING.dimensions.formWidthMin};
	@media (max-width: ${STYLING.cutoffs.tablet}) {
		width: 100%;
	}
`;

export const SpendWrapper = styled.div``;

export const SpendInfoWrapper = styled.div`
	margin: 20px 0 0 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const PriceInfoWrapper = styled(SpendInfoWrapper)`
	margin: 40px 0 0 0;
`;

export const Warning = styled.div`
	margin: 20px 0 0 0;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.warning};
	}
`;

export const SpendInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	span {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		color: ${(props) => props.theme.colors.font.primary.alt1};
	}
	p {
		margin: 12.5px 0 0 0;
		font-size: ${(props) => props.theme.typography.size.lg};
		line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
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

export const SellAction = styled.div`
	margin: 40px 0 0 0;
	span {
		font-size: 24px;
		font-weight: ${(props) => props.theme.typography.weight.medium};
	}
`;

export const SellActionEnd = styled(SellAction)`
	width: fit-content;
	margin: 0 0 0 auto;

	svg {
		height: 22.5px;
		width: 22.5px;
	}
	@media (max-width: ${STYLING.cutoffs.secondary}) {
		margin: 0;
		width: 100%;
		button {
			min-width: 0 !important;
			width: 100% !important;
		}
	}
`;

export const ModalTitle = styled.div`
	p {
		font-size: ${(props) => props.theme.typography.size.base};
		line-height: 1.5;
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.medium};
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
		font-weight: ${(props) => props.theme.typography.weight.medium};
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

export const ErrorMessage = styled.div`
	p {
		color: ${(props) => props.theme.colors.warning};
		font-size: ${(props) => props.theme.typography.size.base};
		font-weight: ${(props) => props.theme.typography.weight.medium};
		line-height: 1.5;
		width: 100%;
		overflow-wrap: break-word;
	}
`;
