import React from 'react';
import { Typography, Button } from 'antd/lib';
import { VeolasManage } from './components';
import { GetMoreOlasRow } from './styles';

const { Title, Paragraph, Text } = Typography;

export const VeOlas = () => (
  <div>
    <Title>veOLAS</Title>
    <Paragraph style={{ maxWidth: 550 }}>
      veOLAS gives you voting power in Autonolas governance. Lock OLAS for
      longer periods to get more veOLAS.&nbsp;
      <a href="www.google.com" target="_blank">
        <Text type="secondary" underline>
          Learn more
        </Text>
      </a>
    </Paragraph>

    <GetMoreOlasRow>
      <Button type="danger">Get more veOLAS</Button>
    </GetMoreOlasRow>

    <VeolasManage />
  </div>
);
