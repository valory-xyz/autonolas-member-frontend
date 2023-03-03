import React, { useState } from 'react';
import {
  Typography, Space, Button, Alert,
} from 'antd/lib';
import { GetMoreVeolas } from './components/GetMoreVeolas';
import { TransferOlas } from './components/TransferOlas';
import { VeolasManage } from './components';
import { useFetchBalances } from './hooks';
import { GetMoreOlasRow } from './styles';

const { Title, Paragraph, Text } = Typography;

export const VeOlas = () => {
  const { canWithdrawVeolas, isMappedAmountZero } = useFetchBalances();
  const canIncreaseAmountOrUnlock = !isMappedAmountZero;

  const [isCreateLockModalVisible, setIsCreateLockModalVisible] = useState(false);
  const [isIncreaseModalVisible, setIsIncreaseModalVisible] = useState(false);

  return (
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
        <Space size="middle">
          <Button
            type="danger"
            disabled={canWithdrawVeolas}
            onClick={() => {
              // if the user has veolas, then show the modal to increase the amount
              // else show the modal to create a lock
              if (canIncreaseAmountOrUnlock) {
                setIsIncreaseModalVisible(true);
              } else {
                setIsCreateLockModalVisible(true);
              }
            }}
          >
            Get more veOLAS
          </Button>

          {canWithdrawVeolas && (
            <Alert
              message="Please claim your OLAS before locking again"
              type="warning"
              showIcon
            />
          )}
        </Space>

        <GetMoreVeolas
          isModalVisible={isCreateLockModalVisible}
          setIsModalVisible={setIsCreateLockModalVisible}
        />
      </GetMoreOlasRow>

      <VeolasManage
        isModalVisible={isIncreaseModalVisible}
        setIsModalVisible={setIsIncreaseModalVisible}
      />

      {/* Transfer button - only for testing */}
      <TransferOlas />
    </div>
  );
};
