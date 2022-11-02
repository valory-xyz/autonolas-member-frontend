import styled from 'styled-components';
// import { COLOR, MEDIA_QUERY } from 'util/theme';

export const VeOlasContainer = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: 940px;
  .balance-container {
    width: 260px;
    margin: 0.25rem 2rem 0 0;
  }
`;

export const WriteFunctionalityContainer = styled.div`
  display: none;
  .forms-container {
    margin-top: 2rem;
    .ant-form {
      max-width: 300px;
    }
  }
`;
