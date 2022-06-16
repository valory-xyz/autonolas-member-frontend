import styled from 'styled-components';
import { Layout } from 'antd';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const CustomLayout = styled(Layout)`
  background-size: 100%;
  .ant-layout-header {
    z-index: 1000;
    position: fixed;
    height: 82px;
    width: 100%;
    padding: 0 1rem;
    margin-top: 1rem;
    background-color: ${COLOR.BLACK};
  }
  .site-layout {
    padding: 0 1rem;
    margin-top: 90px;
  }
  .site-layout-background {
    padding: 2rem 0;
    min-height: calc(100vh - 134px);
  }
  .ant-layout-footer {
    text-align: center;
  }
  .ant-result-title {
    color: ${COLOR.WHITE};
  }

  ${MEDIA_QUERY.tablet} {
    .ant-layout-header {
      ${MEDIA_QUERY.tablet} {
        position: relative;
        height: auto;
      }
    }
    .site-layout-background {
      ${MEDIA_QUERY.tablet} {
        padding: 1rem 0;
      }
    }
    .site-layout {
      margin-top: 0;
    }
  }
`;

// HEADER
export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid ${COLOR.GREY_1};
  background-color: ${COLOR.BLACK};

  ${MEDIA_QUERY.tablet} {
    margin-bottom: 0;
    .column-1 {
      line-height: normal;
    }
  }

  /* nav-bar for pages except landing-page */
  ${MEDIA_QUERY.mobileL} {
    margin-bottom: 0;
  }

  ${MEDIA_QUERY.mobileM} {
    flex-direction: column;
    gap: 1rem;
  }
`;

// FOOTER
export const Container = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 20px;
`;

export const SubFooter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 3rem 1rem;
  border: 1px solid ${COLOR.GREY_1};
  border-radius: 0px 0px 20px 20px;
  border-top-color: transparent;

  .socials {
    display: flex;
    align-items: flex-start;
    .autonolas-twitter {
      display: flex;
      min-width: 240px;
    }
    svg {
      margin-left: 0.5rem;
    }
  }

  .sub-footer-text {
    display: flex;
    flex-direction: column;
    max-width: 700px;
    text-align: right;
  }

  ${MEDIA_QUERY.tabletL} {
    .sub-footer-text {
      display: inline-block;
    }
  }

  ${MEDIA_QUERY.tablet} {
    position: relative;
    top: -3rem;
    flex-direction: column;
    font-size: 16px;
    padding: 4rem 0.75rem 1.5rem 0.75rem;

    .sub-footer-text {
      text-align: left;
      display: inline-block;
      margin-top: 1.5rem;
    }
  }

  ${MEDIA_QUERY.mobileS} {
    .socials {
      .autonolas-twitter {
        min-width: auto;
      }
    }
  }
`;
