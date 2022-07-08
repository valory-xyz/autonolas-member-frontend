import React from 'react';
import styled from 'styled-components';
import { CustomButton as Button } from 'common-util/Button';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TestModal = () => {
  const handleConnect = () => {
    console.log('first');
  };

  return (
    <Container>
      <Button variant="purple" onClick={handleConnect}>
        Connect
      </Button>
    </Container>
  );
};

export default TestModal;
