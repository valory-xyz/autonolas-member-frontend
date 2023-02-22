import { useState } from 'react';
import {
  Button, Row, Col, Modal,
} from 'antd/lib';
import { isNil } from 'lodash';
import {
  notifySuccess,
  CannotIncreaseAlert,
  AlreadyAllAmountLocked,
} from 'common-util/functions';
import { withdrawVeolasRequest } from '../contractUtils';
import { useFetchBalances, useVeolasComponents } from '../hooks';

import { VeolasAddToLock as AddToLock } from './AddToLock';
import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';
import { ModalAlertSection } from '../styles';

export const VeolasManage = () => {
  const {
    account,
    chainId,
    canWithdrawVeolas,
    getData,
    hasNoOlasBalance,
    isMappedAmountZero,
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
          <AddToLock />
        </Col>

        <Col lg={5} xs={12}>
          {getUnlockTimeComponent()}

          {/* to avoid glitch, show the component only if `canWithdrawVeolas`
          is either true or false (default value is null) */}
          {!isNil(canWithdrawVeolas) && (
            <>
              <Button onClick={() => setIsModalVisible(true)} className="mr-12">
                Increase lock
              </Button>
            </>
          )}

          <Button
            htmlType="submit"
            onClick={onWithdraw}
            disabled={isNil(canWithdrawVeolas) || !canWithdrawVeolas}
          >
            Claim all
          </Button>
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
              {getLockedAmountComponent()}
            </Col>

            <Col lg={14} xs={12}>
              {getUnlockTimeComponent()}
            </Col>
          </Row>

          <div className="forms-container">
            <IncreaseAmount />
            <IncreaseUnlockTime />

            {account && (
              <ModalAlertSection>
                {isMappedAmountZero && <CannotIncreaseAlert />}
                {hasNoOlasBalance && !isMappedAmountZero && (
                  <AlreadyAllAmountLocked />
                )}
              </ModalAlertSection>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
