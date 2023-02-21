import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Radio, Button, Row, Col, Modal,
} from 'antd/lib';
import { isNil, isString } from 'lodash';
import {
  formatToEth,
  getFormattedDate,
  getTotalVotesPercentage,
  notifySuccess,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { TAB_KEYS, NA } from 'common-util/constants';
import { withdrawVeolasRequest } from '../utils';
import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';
import { useFetchBalances } from '../hooks';

const FORM_TYPE = {
  increaseAmount: 'typeIncreaseAmount',
  increaseUnlockTime: 'typeIncreaseUnlockTime',
  claim: 'typeClaim',
};

export const VeolasManage = ({ setActiveTab }) => {
  const {
    isLoading,
    account,
    chainId,
    veolasBalance,
    mappedAmount,
    mappedEndTime,
    votes,
    totalSupplyLocked,
    canWithdrawVeolas,
    getData,
  } = useFetchBalances();

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [currentFormType, setCurrentFormType] = useState(
    FORM_TYPE.increaseAmount,
  );

  // on radio button changes
  const onRadioBtnChange = (e) => {
    setCurrentFormType(e.target.value);
  };

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

  // get the value in string
  const getString = (x) => {
    if (isNil(x)) return NA;
    return isString(x) ? x : `${x}`;
  };

  // locked & unlock time component
  const lockedAmountComponent = (
    <InfoCard
      title="Lock"
      value={getString(mappedAmount)}
      subText="locked OLAS"
    />
  );

  const unlockTimeComponent = (
    <InfoCard value={getFormattedDate(mappedEndTime)} subText="unlock date" />
  );

  return (
    <>
      <Row align="top">
        <Col lg={4} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            title="Your balance"
            value={getString(veolasBalance)}
            subText="veOLAS"
          />
        </Col>

        <Col lg={3} md={12} xs={12}>
          <InfoCard
            title="Voting power"
            value={getString(formatToEth(votes))}
            subText="votes"
          />
        </Col>

        <Col lg={5} md={12} xs={12}>
          <InfoCard
            value={
              Number(votes) === 0 || Number(totalSupplyLocked) === 0
                ? '0%'
                : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`
            }
            subText="% of total voting power"
          />
        </Col>

        <Col lg={4} xs={12}>
          {lockedAmountComponent}
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
          {unlockTimeComponent}
        </Col>
      </Row>

      {isModalVisible && (
        <Modal
          title="Increase Lock"
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <Row align="top">
            <Col lg={10} xs={12}>
              {lockedAmountComponent}
            </Col>

            <Col lg={14} xs={12}>
              {unlockTimeComponent}
            </Col>
          </Row>

          <Radio.Group
            onChange={onRadioBtnChange}
            value={currentFormType}
            style={{ display: 'none' }}
          >
            <Radio value={FORM_TYPE.increaseAmount}>Increase Amount</Radio>
            <Radio value={FORM_TYPE.increaseUnlockTime}>
              Increase Unlock Time
            </Radio>
          </Radio.Group>

          <div className="forms-container">
            {currentFormType === FORM_TYPE.increaseAmount && <IncreaseAmount />}
            {currentFormType === FORM_TYPE.increaseUnlockTime && (
              <IncreaseUnlockTime />
            )}
          </div>
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
