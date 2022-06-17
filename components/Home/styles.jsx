import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const MiddleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3rem auto 0 auto;
  max-width: 500px;
  border: 1px solid ${COLOR.ANTD_ORANGE};
  padding: 2rem;
  border-radius: 1rem;
  font-size: 16px;
  .section {
    .info {
      margin-bottom: 1rem;
      .balance {
        margin-left: 0.5rem;
        font-weight: bold;
        color: ${COLOR.PRIMARY};
      }
    }
  }

  ${MEDIA_QUERY.desktop} {
  }

  ${MEDIA_QUERY.mobileL} {
    flex-direction: column;
    gap: 2rem;
  }
`;
