import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const Container = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 20px;
  font-family: "spacegrotesk__regular";
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
