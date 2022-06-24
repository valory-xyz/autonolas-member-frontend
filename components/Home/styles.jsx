import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const MiddleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin: 3rem auto 0 auto;
  max-width: 620px;
  border: 1px solid ${COLOR.ANTD_ORANGE};
  padding: 2rem;
  border-radius: 1rem;
  font-size: 16px;
  .sections {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .section {
      .info {
        margin-bottom: 1rem;
        .balance {
          margin-left: 0.5rem;
          font-weight: bold;
          color: ${COLOR.PRIMARY};
          font-size: 24px;
        }
      }
    }
  }

  ${MEDIA_QUERY.tablet} {
    flex-direction: column;
    gap: 2rem;
    .sections {
      flex-direction: column;
    }
  }
`;
