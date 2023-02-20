import React from 'react';
import { Typography } from 'antd/lib';
import { VeolasCreateLock } from './CreateLock';
import { VeolasManage } from './ManageYourLock';

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

    <VeolasCreateLock />
    <VeolasManage />
  </div>
);
