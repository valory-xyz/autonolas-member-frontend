import PropTypes from 'prop-types';
import {
  Button, Row, Col, Modal, Tabs,
} from 'antd';
import { isNil } from 'lodash';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';

import { withdrawVeolasRequest } from '../contractUtils';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';

export const VeolasManage = ({ isModalVisible, setIsModalVisible }) => {
  const { account, canWithdrawVeolas, getData } = useFetchBalances();
  const {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
    getUnlockedAmountComponent,
  } = useVeolasComponents();

  const onWithdraw = async () => {
    try {
      await withdrawVeolasRequest({ account });
      notifySuccess('Claimed successfully');

      // fetch all the data again to update
      // amount, time, votes, etc
      getData();
    } catch (error) {
      window.console.error(error);
      notifyError();
    }
  };

  const closeModalOnSuccess = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Row align="top">
        <Col lg={6} md={24} xs={24}>
          {getBalanceComponent()}
        </Col>

        <Col lg={6} md={12} xs={12}>
          {getVotingPowerComponent()}
        </Col>

        <Col lg={6} md={12} xs={12}>
          {getVotingPercentComponent()}
        </Col>
      </Row>

      <br />
      <Row align="top">
        <Col lg={6} xs={12}>
          {getLockedAmountComponent()}
        </Col>

        <Col lg={6} xs={12}>
          {getUnlockTimeComponent()}

          {/* to avoid glitch, show the component only if `canWithdrawVeolas`
          is either true or false (default value is null) */}
          {!isNil(canWithdrawVeolas) && (
            <>
              {canWithdrawVeolas && (
                <Button htmlType="submit" onClick={onWithdraw}>
                  Claim all
                </Button>
              )}
            </>
          )}
        </Col>

        <Col lg={6} xs={12}>
          {getUnlockedAmountComponent()}
        </Col>
      </Row>

      {isModalVisible && (
        <Modal
          title="Increase Lock"
          open={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
          style={{ top: 60 }}
        >
          <Tabs
            defaultActiveKey="by_olas_amount"
            items={[
              {
                key: 'by_olas_amount',
                tabKey: 'by_olas_amount',
                label: 'By OLAS Amount',
                children: <IncreaseAmount closeModal={closeModalOnSuccess} />,
              },
              {
                key: 'by_lock_duration',
                tabKey: 'by_lock_duration',
                label: 'By Lock Duration',
                children: (
                  <IncreaseUnlockTime closeModal={closeModalOnSuccess} />
                ),
              },
            ]}
          />
        </Modal>
      )}
    </>
  );
};

VeolasManage.propTypes = {
  isModalVisible: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
};

VeolasManage.defaultProps = {
  isModalVisible: false,
  setIsModalVisible: () => {},
};
