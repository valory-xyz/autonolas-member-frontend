import styled, { createGlobalStyle } from 'styled-components';
import { MEDIA_QUERY, COLOR } from '@autonolas/frontend-library';

const ANTD_COLOR = {
  borderColor: '#f0f0f0',
};

// const GlobalStyles = styled.div`
const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  background-size: 100%;
  background-color: ${COLOR.WHITE};

  body {
    padding: 1rem;
  }

  /* common */
  .mb-8 {
    margin-bottom: 0.5rem;
  }
  .mb-12 {
    margin-bottom: 12px !important;
  }
  .mr-12 {
    margin-right: 12px;
  }
  .mt-12 {
    margin-top: 12px;
  }
  .mb-12 {
    margin-bottom: 12px;
  }
  .walletconnect-modal__base {
    .walletconnect-modal__mobile__toggle a {
      color: ${COLOR.WALLECT_CONNECT_BLUE} !important;
    }
  }
  .ant-alert {
    border-radius: 5px;
  }
  .show-only-sm {
    display: none;
  }
  .hide-only-sm {
    display: initial;
  }

  /* layout */
  .ant-layout {
    background: ${COLOR.WHITE};
  }
  .ant-layout-header {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 1;
    width: calc(100% - 32px);
    padding: 0 24px;
    height: 80px;
    .ant-menu {
      flex: 1;
      &.ant-menu-horizontal {
        border: none;
      }
      &.ant-menu-horizontal > .ant-menu-item::after,
      .ant-menu-horizontal > .ant-menu-submenu::after {
        border-bottom: none !important;
      }
      .ant-menu-item-selected {
        font-weight: bold;
      }
    }
  }

  /* tabs */
  .ant-tabs-card.ant-tabs-top {
    > .ant-tabs-nav .ant-tabs-tab {
      border-radius: 18px;
      background-color: transparent;
      border-color: transparent !important;
    }
    > .ant-tabs-nav .ant-tabs-tab-active {
      border-bottom-color: ${ANTD_COLOR.borderColor};
      background-color: ${COLOR.GREY_1};
      .ant-tabs-tab-btn {
        color: ${COLOR.BLACK};
      }
    }
  }

  /* modal */
  .ant-modal-body {
    padding: 12px 24px;
  }

  /* layout */
  .site-layout {
    padding: 0 2rem;
    margin-top: 56px;
    + div {
      padding-left: 32px;
    }
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 8.5rem);
  }

  ${MEDIA_QUERY.mobileL} {
    .show-only-sm {
      display: initial;
    }
    .hide-only-sm {
      display: none;
    }
  }

  .ant-layout-footer {
    text-align: center;
  }
  .ant-result-title {
    color: ${COLOR.BLACK};
  }

  /* form */
  .ant-form-item-label > label {
    font-weight: bold;
  }
  .add-lock-form-item {
    margin-bottom: 4px;
  }

  /* button */
  .ant-btn-danger {
    text-shadow: none;
  }

  ${MEDIA_QUERY.tablet} {
    body {
      padding: 0rem;
    }
    .ant-layout-header {
      position: relative;
      flex-direction: column;
      height: auto;
      padding: 0;
    }
    .site-layout-background {
      padding: 1rem 0;
      min-height: calc(100vh - 20rem);
    }
    .site-layout {
      margin-top: 0;
    }
  }

  ${MEDIA_QUERY.mobileL} {
    .ant-layout-header {
      width: 100%;
    }
  }
`;

export default GlobalStyle;

export const Ellipsis = styled.span`
  max-width: 100px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${MEDIA_QUERY.tablet} {
    max-width: 200px;
  }
`;
