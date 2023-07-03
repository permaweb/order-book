import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';

export const Wrapper = styled.div`
    position: relative;
    animation: ${open} ${fadeIn2};
`;

export const Dropdown = styled.div`
    width: 300px;
    max-width: 100vw;
    position: absolute;
    right: 0;
    z-index: 1;
    margin: 5px 0 0 0;
    padding: 20px;
`;

export const DREWrapper = styled.div`
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        line-height: calc(${(props) => props.theme.typography.size.small} + 5px);
        font-family: ${(props) => props.theme.typography.family.primary};
        font-weight: ${(props) => props.theme.typography.weight.bold};
        color: ${(props) => props.theme.colors.font.primary.alt1};
        margin: 0 0 12.5px 0;
        padding: 0 0 5px 0;
        border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
    }
    button {
        margin: 10px 0 0 0;
    }
`;