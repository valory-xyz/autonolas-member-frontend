import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const MiddleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 500px;
  border: 1px solid red;
  padding: 2rem;
  border-radius: 1rem;
  font-size: 16px;
  .section {
    .info {
      margin-bottom: 1rem;
      .balance {
        color: ${COLOR.PRIMARY};
        font-weight: bold;
      }
    }
  }
  ${MEDIA_QUERY.desktop} {
  }

  ${MEDIA_QUERY.tablet} {
  }
`;
