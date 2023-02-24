import React from 'react';
import { Typography } from 'antd/lib';
import { AddToLock } from './components/AddToLock';
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
      <AddToLock />
    </GetMoreOlasRow>

    <VeolasManage />
  </div>
);
