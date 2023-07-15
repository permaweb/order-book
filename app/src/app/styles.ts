import { createGlobalStyle } from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
    background: ${(props) => props.theme.colors.view.background};
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: none;
  }

  html, body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    font-weight: ${(props) => props.theme.typography.weight.light};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  

  a {
    text-decoration: none;
  }


  * {
    box-sizing: border-box;
    &:focus {
      outline: 0;
    }
  }

  h1 {
    font-size: ${(props) => props.theme.typography.size.h1};
    font-family: ${(props) => props.theme.typography.family.primary};
    font-weight: ${(props) => props.theme.typography.weight.light};
  }

  h2 {
    font-size: ${(props) => props.theme.typography.size.h2};
    font-family: ${(props) => props.theme.typography.family.primary};
    font-weight: ${(props) => props.theme.typography.weight.light};
    color: ${(props) => props.theme.colors.font.primary.alt1};
  }

  b {
    font-weight: ${(props) => props.theme.typography.weight.light};
  }
  
  p, span, button, a, b, li, input, textarea, pre {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    font-size: ${(props) => props.theme.typography.size.small};
    font-weight: ${(props) => props.theme.typography.weight.light};
    color: ${(props) => props.theme.colors.font.primary.alt1};
  }

  button {
    font-size: ${(props) => props.theme.typography.size.xSmall};
    font-weight: ${(props) => props.theme.typography.weight.light};
  }

  a {
    color: ${(props) => props.theme.colors.font.primary.active.base};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 1.215px;
    }
    &:focus {
      text-decoration: underline;
    }
  }
  
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    transition: background .1s;

    &:hover {
      cursor: pointer;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  input, textarea {
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: ${(props) => props.theme.colors.form.background};
    border: 1px solid ${(props) => props.theme.colors.form.border};
    color: ${(props) => props.theme.colors.font.primary.alt1};
    margin: 0;
    padding: 10px;
    &:disabled {
      cursor: not-allowed;
    }
  }

  input {
    padding: 10px 15px;
  }

  textarea {
    resize: none;
    height: 170px;
  }

  .view-wrapper {
    width: 100%;
    margin: 0 auto;
    animation: ${open} ${fadeIn2};
    padding: 20px;
  }

  .max-cutoff {
    width: 100%;
    max-width: ${STYLING.cutoffs.max};
    margin: 0 auto;
  }

  .border-wrapper {
    background: ${(props) => props.theme.colors.container.primary.background};
    border-radius: ${STYLING.dimensions.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
  }

  .border-wrapper-alt {
    background: ${(props) => props.theme.colors.container.alt2.background};
    border-radius: ${STYLING.dimensions.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
  }

  .background-wrapper {
    position: relative;
    overflow: visible;
  }
  
  .background-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 500px;
    background: ${(props) =>
			`linear-gradient(to bottom, ${props.theme.colors.container.primary.backgroundGradient}, ${props.theme.colors.container.primary.background1Gradient})`};
    z-index: -1;
  }  
`;
