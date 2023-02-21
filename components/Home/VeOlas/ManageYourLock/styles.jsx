import styled from 'styled-components';

export const WriteFunctionalityContainer = styled.div`
  .forms-container {
    margin-top: 2rem;
    .ant-form {
      max-width: 300px;
    }
  }
`;

export const FormContainer = styled.div`
  .custom-vertical-form {
    display: flex;
    align-items: flex-start;
    > .ant-form-item:last-child {
      margin-top: 36px;
      margin-left: 12px;
    }
    .ant-form-item {
      margin-bottom: 4px;
    }
  }
`;
