import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Radio, Statistic, Button } from 'antd/lib';
import { useSelector, useDispatch } from 'react-redux';
import { isNil } from 'lodash';
import {
  fetchOlasBalance,
  fetchMappedBalances,
  fetchVotesAndTotalSupplyLocked,
  fetchIfCanWithdrawVeolas,
} from 'store/setup/actions';
import {
  formatToEth,
  getTotalVotesPercentage,
  notifySuccess,
} from 'common-util/functions';
import { TAB_KEYS } from 'common-util/constants';
import { getToken } from '../common';
import { IncreaseAmount, IncreaseUnlockTime } from './WriteFunctionality';
import { withdrawRequest } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { VeOlasContainer, WriteFunctionalityContainer } from './styles';

const { Countdown } = Statistic;

const FORM_TYPE = {
  increaseAmount: 'typeIncreaseAmount',
  increaseUnlockTime: 'typeIncreaseUnlockTime',
  claim: 'typeClaim',
};

const VeOlas = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
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
  const [currentFormType, setCurrentFormType] = useState(
    FORM_TYPE.increaseAmount,
  );

  const getData = () => {
    dispatch(fetchOlasBalance());
    dispatch(fetchVotesAndTotalSupplyLocked());
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

  /**
   * on radio button changes
   */
  const onChange = (e) => {
    window.console.log('radio checked', e.target.value);
    setCurrentFormType(e.target.value);
  };

  // on withdraw
  const onWithdraw = async () => {
    try {
      await withdrawRequest({ account, chainId });
      notifySuccess('Withdrawn successfully');

      getData();
      setActiveTab(TAB_KEYS.createLock);
    } catch (error) {
      window.console.error(error);
    }
  };

  return (
    <VeOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>Locked OLAS</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: mappedAmount,
              isLoading,
            })}
            {getToken({
              tokenName: 'Unlocking time',
              isLoading,
              token: (
                <>
                  {mappedEndTime ? (
                    <Countdown value={mappedEndTime} format="MM DD HH:mm:ss" />
                  ) : (
                    '--'
                  )}
                </>
              ),
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>veOLAS Balance</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Votes',
              token: formatToEth(votes),
              isLoading,
            })}
            {getToken({
              tokenName: 'Total Voting power %',
              token:
                Number(votes) === 0 || Number(totalSupplyLocked) === 0
                  ? '--'
                  : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`,
              isLoading,
            })}
          </Sections>
        </MiddleContent>
      </div>

      <WriteFunctionalityContainer>
        {!isNil(canWithdrawVeolas) && (
          <>
            {canWithdrawVeolas ? (
              <Button type="primary" htmlType="submit" onClick={onWithdraw}>
                Withdraw
              </Button>
            ) : (
              <>
                <Radio.Group onChange={onChange} value={currentFormType}>
                  <Radio value={FORM_TYPE.increaseAmount}>
                    Increase Amount
                  </Radio>
                  <Radio value={FORM_TYPE.increaseUnlockTime}>
                    Increase Unlock Time
                  </Radio>
                  {/* <Radio value={FORM_TYPE.claim}>Claim</Radio> */}
                </Radio.Group>

                <div className="forms-container">
                  {currentFormType === FORM_TYPE.increaseAmount && (
                    <IncreaseAmount />
                  )}
                  {currentFormType === FORM_TYPE.increaseUnlockTime && (
                    <IncreaseUnlockTime />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </WriteFunctionalityContainer>
    </VeOlasContainer>
  );
};

VeOlas.propTypes = {
  setActiveTab: PropTypes.func,
};

VeOlas.defaultProps = {
  setActiveTab: () => {},
};

export default VeOlas;
