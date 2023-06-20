import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
    height: 40px;
    width: 80px;
    background: ${(props) => props.theme.colors.container.alt5.background};
    border-radius: ${STYLING.dimensions.borderRadius};
    display: flex;
    align-items: center;
    padding: 0 10px;
    p {
        font-size: ${(props) => props.theme.typography.size.base} !important;
        font-weight: ${(props) => props.theme.typography.weight.bold} !important;
        font-family: ${(props) => props.theme.typography.family.alt1} !important;
        color: ${(props) => props.theme.colors.font.primary.base} !important;
    }
    .s-divider {
        margin: 0 10px;
        height: 65%;
        width: 2px;
        border-left: 2px solid ${(props) => props.theme.colors.border.alt3};
    }
    svg {
        height: 30px !important;
        width: 25px !important;
    }
`;