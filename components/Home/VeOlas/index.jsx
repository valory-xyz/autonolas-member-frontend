import { useState, useEffect } from 'react';
import { Radio, Statistic } from 'antd/lib';
import { useSelector, useDispatch } from 'react-redux';
import { setMappedBalances } from 'store/setup/actions';
import { getToken } from '../common';
import { IncreaseAmount, IncreaseUnlockTime } from './WriteFunctionality';
import {
  fetchVotes,
  fetchTotalSupplyLocked,
  fetchMapLockedBalances,
  // fetchTotalSupplyOfOlas,
  // mintOlas,
  // fetchBalanceOf,
} from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { VeOlasContainer, WriteFunctionalityContainer } from './styles';

const { Countdown } = Statistic;

const FORM_TYPE = {
  increaseAmount: 'typeIncreaseAmount',
  increaseUnlockTime: 'typeIncreaseUnlockTime',
  claim: 'typeClaim',
};

const VeOlas = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const mappedAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.amount || null,
  );
  const mappedEndTime = useSelector(
    (state) => state?.setup?.mappedBalances?.endTime || null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotesCount] = useState(null);
  const [totalSupplyLocked, setTotalSupplyLocked] = useState(null);
  const [currentFormType, setCurrentFormType] = useState(
    FORM_TYPE.increaseAmount,
  );

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          // await fetchTotalSupplyOfOlas({ chainId });
          // await mintOlas({ account, chainId });
          // await fetchBalanceOf({ account, chainId });

          const votesResponse = await fetchVotes({ account, chainId });
          setVotesCount(votesResponse);

          const total = await fetchTotalSupplyLocked({ chainId });
          setTotalSupplyLocked(total);

          const data = await fetchMapLockedBalances({
            account,
            chainId,
          });
          dispatch(setMappedBalances(data));
        } catch (error) {
          window.console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fn();
  }, [account, chainId]);

  // Create Lock
  const onChange = (e) => {
    window.console.log('radio checked', e.target.value);
    setCurrentFormType(e.target.value);
  };

  return (
    <VeOlasContainer>
      <div className="left-content">
        {/* TODO: delete below `MiddleContent` it not used - ask Mariapia */}
        <MiddleContent
          className="balance-container"
          style={{ display: 'none' }}
        >
          <SectionHeader>veOLAS Balance</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Votes',
              token: votes,
              isLoading,
            })}
            {getToken({
              tokenName: 'Total Voting power',
              token: totalSupplyLocked,
              isLoading,
            })}
          </Sections>
        </MiddleContent>

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
      </div>

      <WriteFunctionalityContainer>
        <Radio.Group onChange={onChange} value={currentFormType}>
          <Radio value={FORM_TYPE.increaseAmount}>Increase Amount</Radio>
          <Radio value={FORM_TYPE.increaseUnlockTime}>
            Increase Unlock Time
          </Radio>
          {/* <Radio value={FORM_TYPE.claim}>Claim</Radio> */}
        </Radio.Group>

        <div className="forms-container">
          {currentFormType === FORM_TYPE.increaseAmount && <IncreaseAmount />}
          {currentFormType === FORM_TYPE.increaseUnlockTime && (
            <IncreaseUnlockTime />
          )}
        </div>
      </WriteFunctionalityContainer>
    </VeOlasContainer>
  );
};

export default VeOlas;
/**
 * mint using Account #0
 *
 * mint Olas for account 1
 * switch to account 1 -> do the lock -> by calling the fuction from veOlas
 *
 * check the lock-balance
 *
 * // withdraw for veOlas is pending
 */
