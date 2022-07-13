import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const Container = styled.div`
  max-width: 340px;
  margin: auto;
`;

export const MiddleContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  margin: 3rem auto 0 auto;
  border: 1px solid ${COLOR.BORDER_GREY};
  padding: 1.25rem;
  border-radius: 5px;
  font-size: 16px;
  .section-header {
    font-weight: normal;
  }
  .sections {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    .section {
      .info {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        .balance {
          font-size: 34px;
          line-height: normal;
        }
      }
    }
  }
  .section-footer {
    line-height: normal;
    margin-top: 1.25rem;
    color: #6b6b6b;
  }

  ${MEDIA_QUERY.tablet} {
    flex-direction: column;
    gap: 2rem;
    .sections {
      flex-direction: column;
    }
  }
`;

export const TransactionSuccessMessage = styled.div`
  .t-id {
    display: flex;
    line-height: normal;
    margin-top: 0.35rem;
  }
`;
