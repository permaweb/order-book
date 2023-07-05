import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	position: relative;
	width: 100%;
`;

export const SearchWrapper = styled.div`
	height: ${STYLING.dimensions.formHeightSm};
	width: ${STYLING.dimensions.formWidthMax};
	width: 100%;
	overflow: visible;
	position: relative;
`;

export const SearchIcon = styled.div<{ disabled: boolean | undefined }>`
    svg {
        position: absolute;
        top: 9.15px;
        left: 17.5px;
        width: 15px;
        fill ${(props) => props.theme.colors.icon.primary.alt1.fill};
        &:hover {
            cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
        }
    }
`;

export const SearchInput = styled.input<{ hasResults: boolean }>`
	height: ${STYLING.dimensions.formHeightSm};
	width: 100%;
	font-size: ${(props) => props.theme.typography.size.small};
	font-weight: ${(props) => props.theme.typography.weight.medium};
	color: ${(props) => props.theme.colors.font.primary.alt8};
	background: ${(props) => props.theme.colors.container.primary.background};
	border-top: 1px solid ${(props) => props.theme.colors.form.border};
	border-bottom: ${(props) => (props.hasResults ? `none` : `1px solid ${props.theme.colors.form.border}`)};
	border-right: 1px solid ${(props) => props.theme.colors.form.border};
	border-left: 1px solid ${(props) => props.theme.colors.form.border};
	border-top-left-radius: ${STYLING.dimensions.borderRadius};
	border-top-right-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-left-radius: ${(props) => (props.hasResults ? `0` : `${STYLING.dimensions.borderRadius}`)};
	border-bottom-right-radius: ${(props) => (props.hasResults ? `0` : `${STYLING.dimensions.borderRadius}`)};
	padding: 10px 35px 10px 40px;
	&:disabled {
		background: ${(props) => props.theme.colors.form.disabled.background};
		color: ${(props) => props.theme.colors.form.disabled.label};
		box-shadow: none;
		border: 1px solid ${(props) => props.theme.colors.form.border};
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		font-size: ${(props) => props.theme.typography.size.base};
	}
`;

export const ClearWrapper = styled.div`
	position: absolute;
	right: 14.5px;
	top: 50.5%;
	transform: translate(0, -50%);
	button {
		width: auto;
	}
	svg {
		height: auto;
		width: auto;
		width: 12.5px;
		height: auto;
		padding: 3.5px 0 0 0;
	}
`;

export const SearchButtonWrapper = styled.div`
	margin: 0 0 0 20px;
	align-items: center;

	@media (max-width: ${STYLING.cutoffs.secondary}) {
		display: none;
	}
`;

export const SearchResultsWrapper = styled.div`
	width: 100%;
	position: absolute;
	top: calc(${STYLING.dimensions.formHeightSm} + 0px);
	background: ${(props) => props.theme.colors.container.primary.background};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
	border-right: 1px solid ${(props) => props.theme.colors.border.primary};
	border-left: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
	overflow: hidden;
	padding: 0 0 10px 0;
	a {
		&:hover {
			text-decoration: none !important;
		}
	}
	@media (max-width: ${STYLING.cutoffs.initial}) {
		position: relative;
		top: auto;
	}
`;

export const SearchResult = styled.div`
	height: 45px;
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0 10px;
	background: ${(props) => props.theme.colors.container.primary.background};
	&:hover {
		background: ${(props) => props.theme.colors.container.primary.hover};
		cursor: pointer;
	}
`;

export const AssetData = styled.div`
	min-height: 30px;
	height: 30px;
	min-width: 30px;
	width: 30px;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusField};
	overflow: hidden;
	svg {
		padding: 2.5px 0 0 0;
		max-height: 20px !important;
		max-width: 20px !important;
	}
`;

export const DetailLine = styled.div`
	width: calc(100% - 45px);
	margin: 0 0 0 10px;
	p {
		font-size: ${(props) => props.theme.typography.size.xSmall};
		line-height: calc(${(props) => props.theme.typography.size.xSmall} + 5px);
		font-family: ${(props) => props.theme.typography.family.primary};
		font-weight: ${(props) => props.theme.typography.weight.bold};
		color: ${(props) => props.theme.colors.font.primary.alt1};
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

export const LoadingWrapper = styled(DetailLine)`
	width: fit-content;
	margin: 10px 0px 0 18.5px;
`;

export const SPaginator = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 0 10px;
	margin: 10px 0 0 0;
	align-items: center;
`;
