import { createGlobalStyle } from 'styled-components';
import { MEDIA_QUERY, COLOR } from 'util/theme';

// const GlobalStyles = styled.div`
const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }
  body,
  html {
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    margin: 0;
    font-family: texgyreheros__regular, sans-serif;
  }
  /* common */
  .mb-8 {
    margin-bottom: 0.5rem;
  }

  .walletconnect-modal__base {
    .walletconnect-modal__mobile__toggle a {
      color: ${COLOR.WALLECT_CONNECT_BLUE} !important;
    }
  }

  .show-only-sm {
    display: none;
  }
  .hide-only-sm {
    display: initial;
  }
  ${MEDIA_QUERY.mobileL} {
    .show-only-sm {
      display: initial;
    }
    .hide-only-sm {
      display: none;
    }
  }
`;

export default GlobalStyle;
