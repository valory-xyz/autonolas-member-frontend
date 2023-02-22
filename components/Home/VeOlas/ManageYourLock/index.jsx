import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, Modal,
} from 'antd/lib';
import { isNil } from 'lodash';
import {
  notifySuccess,
  CannotIncreaseAlert,
  AlreadyAllAmountLocked,
} from 'common-util/functions';
import { TAB_KEYS } from 'common-util/constants';
import { withdrawVeolasRequest } from '../utils';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';
import { ModalAlertSection } from './styles';

export const VeolasManage = ({ setActiveTab }) => {
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
  } = useVeolasComponents();

  const [isModalVisible, setIsModalVisible] = useState(true);

  const onWithdraw = async () => {
    try {
      await withdrawVeolasRequest({ account, chainId });
      notifySuccess('Withdrawn successfully');

      // fetch all the data again to update
      // amount, time, votes, etc
      getData();
      setActiveTab(TAB_KEYS.createLock);
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
          {/* to avoid glitch, show the component only if `canWithdrawVeolas`
          is either true or false (default value is null) */}
          {!isNil(canWithdrawVeolas) && (
            <>
              {canWithdrawVeolas ? (
                <Button type="primary" htmlType="submit" onClick={onWithdraw}>
                  Withdraw
                </Button>
              ) : (
                <Button onClick={() => setIsModalVisible(true)}>
                  Increase lock
                </Button>
              )}
            </>
          )}
        </Col>

        <Col lg={6} xs={12}>
          {getUnlockTimeComponent()}
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

          <Row align="top">
            <Col lg={10} xs={12}>
              {getVotingPowerComponent()}
            </Col>

            <Col lg={14} xs={12}>
              {getVotingPercentComponent()}
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

VeolasManage.propTypes = {
  setActiveTab: PropTypes.func,
};

VeolasManage.defaultProps = {
  setActiveTab: () => {},
};
