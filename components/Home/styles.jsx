import styled, { css } from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

const regularFontStyles = css`
  color: ${COLOR.GREY_1};
  font-size: 16px;
  font-weight: 300;
`;

export const MiddleContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  ${regularFontStyles}
  .right-columm {
    padding-left: 1rem;
  }
  .card-border {
    padding: 1rem;
    border-radius: 20px;
  }

  ${MEDIA_QUERY.desktop} {
    .ant-card:nth-child(even) {
      margin-right: 0;
    }
  }

  ${MEDIA_QUERY.tablet} {
    .right-columm {
      padding-left: 0rem;
      margin-top: 1rem;
    }
    .ant-card {
      max-width: 100%;
      margin-right: 0;
      &-body {
        img {
          height: auto !important;
        }
      }
    }
  }
`;

export const XXX = styled.div``;
