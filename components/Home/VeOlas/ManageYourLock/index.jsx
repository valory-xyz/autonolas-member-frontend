import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Radio, Button, Row, Col, Modal,
} from 'antd/lib';
import { isNil, isString } from 'lodash';
import {
  fetchOlasBalance,
  fetchMappedBalances,
  fetchVeolasDetails,
  fetchIfCanWithdrawVeolas,
} from 'store/setup/actions';
import {
  formatToEth,
  getFormattedDate,
  getTotalVotesPercentage,
  notifySuccess,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { TAB_KEYS } from 'common-util/constants';
import { withdrawVeolasRequest } from '../utils';
import { IncreaseAmount } from './IncreaseAmount';
import { IncreaseUnlockTime } from './IncreaseUnlockTime';

const FORM_TYPE = {
  increaseAmount: 'typeIncreaseAmount',
  increaseUnlockTime: 'typeIncreaseUnlockTime',
  claim: 'typeClaim',
};

export const VeolasManage = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const veolasBalance = useSelector((state) => state?.setup?.veolasBalance);
  const mappedAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.amount || null,
  );
  const mappedEndTime = useSelector(
    (state) => state?.setup?.mappedBalances?.endTime || null,
  );
  const votes = useSelector((state) => state?.setup?.votes || null);
  const totalSupplyLocked = useSelector(
    (state) => state?.setup?.totalSupplyLocked || null,
  );
  const canWithdrawVeolas = useSelector(
    (state) => state?.setup?.canWithdrawVeolas,
  );

  const [isLoading, setIsLoading] = useState(!!account);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFormType, setCurrentFormType] = useState(
    FORM_TYPE.increaseAmount,
  );

  const getData = () => {
    dispatch(fetchOlasBalance());
    dispatch(fetchVeolasDetails());
    dispatch(fetchMappedBalances());
    dispatch(fetchIfCanWithdrawVeolas());
  };

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          getData();
        } catch (error) {
          window.console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fn();
  }, [account, chainId]);

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
    if (isNil(x)) return '--';
    return isString(x) ? x : `${x}`;
  };

  return (
    <>
      <Row align="top">
        <Col lg={4} xs={24}>
          <InfoCard
            isLoading={isLoading}
            title="Your balance"
            value={getString(veolasBalance)}
            subText="veOLAS"
          />
        </Col>

        <Col lg={3} xs={12}>
          <InfoCard
            title="Voting power"
            value={getString(formatToEth(votes))}
            subText="votes"
          />
        </Col>

        <Col lg={5} xs={12}>
          <InfoCard
            value={
              Number(votes) === 0 || Number(totalSupplyLocked) === 0
                ? '--'
                : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`
            }
            subText="% of total voting power"
          />
        </Col>

        <Col lg={4} xs={12}>
          <InfoCard
            title="Lock"
            value={getString(mappedAmount)}
            subText="locked OLAS"
          />
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

        <Col lg={5} xs={12}>
          <InfoCard
            value={getFormattedDate(getString(mappedEndTime))}
            subText="unlock date"
          />
        </Col>
      </Row>

      {isModalVisible && (
        <Modal
          title="Increase Lock"
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <Radio.Group onChange={onRadioBtnChange} value={currentFormType}>
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
