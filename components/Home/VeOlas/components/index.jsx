import { useState } from 'react';
import {
  Button, Row, Col, Modal,
} from 'antd/lib';
import { isNil } from 'lodash';
import { notifySuccess } from 'common-util/functions';
import { withdrawVeolasRequest } from '../contractUtils';
import { useFetchBalances, useVeolasComponents } from '../hooks';

import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';

export const VeolasManage = () => {
  const {
    account, chainId, canWithdrawVeolas, getData, isMappedAmountZero,
  } = useFetchBalances();
  const {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
    getUnlockedAmountComponent,
  } = useVeolasComponents();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onWithdraw = async () => {
    try {
      await withdrawVeolasRequest({ account, chainId });
      notifySuccess('Withdrawn successfully');

      // fetch all the data again to update
      // amount, time, votes, etc
      getData();
    } catch (error) {
      window.console.error(error);
    }
  };

  return (
    <>
      <Row align="top">
        <Col lg={4} md={24} xs={24}>
          {getBalanceComponent()}
        </Col>

        <Col lg={3} md={12} xs={12}>
          {getVotingPowerComponent()}
        </Col>

        <Col lg={5} md={12} xs={12}>
          {getVotingPercentComponent()}
        </Col>

        <Col lg={4} xs={12}>
          {getLockedAmountComponent()}
        </Col>

        <Col lg={5} xs={12}>
          {getUnlockTimeComponent()}

          {/* to avoid glitch, show the component only if `canWithdrawVeolas`
          is either true or false (default value is null) */}
          {!isNil(canWithdrawVeolas) && (
            <>
              {/* do not show if lock does not exist
              (ie. show if already exists) */}
              {!isMappedAmountZero && (
                <Button
                  onClick={() => setIsModalVisible(true)}
                  className="mr-12"
                >
                  Increase lock
                </Button>
              )}

              {canWithdrawVeolas && (
                <Button htmlType="submit" onClick={onWithdraw}>
                  Claim all
                </Button>
              )}
            </>
          )}
        </Col>

        <Col lg={3} xs={12}>
          {getUnlockedAmountComponent()}
        </Col>
      </Row>

      {isModalVisible && (
        <Modal
          title="Increase Lock"
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
          style={{ top: 60 }}
        >
          <Row align="top">
            <Col lg={10} xs={12}>
              {getLockedAmountComponent({ hideTitle: true })}
            </Col>

            <Col lg={14} xs={12}>
              {getUnlockTimeComponent({ hideTitle: true })}
            </Col>
          </Row>

          <div className="forms-container">
            <IncreaseAmount />
            <IncreaseUnlockTime />
          </div>
        </Modal>
      )}
    </>
  );
};
