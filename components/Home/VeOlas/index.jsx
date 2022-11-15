import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Radio, Statistic } from 'antd/lib';
import { getToken } from '../common';
import { IncreaseAmount, IncreaseUnlockTime } from './WriteFunctionality';
import {
  fetchVotes,
  fetchTotalSupplyLocked,
  fetchMapLockedBalances,
} from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { VeOlasContainer, WriteFunctionalityContainer } from './styles';

const { Countdown } = Statistic;

const FORM_TYPE = {
  increaseAmount: 'typeIncreaseAmount',
  increaseUnlockTime: 'typeIncreaseUnlockTime',
  claim: 'typeClaim',
};

const VeOlas = ({ account, chainId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotesCount] = useState(null);
  const [totalSupplyLocked, setTotalSupplyLocked] = useState(null);
  const [mappedAmount, setMappedAmount] = useState(null);
  const [mappedEndTime, setMappedEndTime] = useState(null);
  const [currentFormType, setCurrentFormType] = useState(
    FORM_TYPE.increaseAmount,
  );

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          const votesResponse = await fetchVotes({ account, chainId });
          setVotesCount(votesResponse);

          const total = await fetchTotalSupplyLocked({ chainId });
          setTotalSupplyLocked(total);

          const { amount, endTime } = await fetchMapLockedBalances({
            account,
            chainId,
          });
          setMappedAmount(amount);
          setMappedEndTime(endTime);
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
        {/* TODO: delete? */}
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
          {currentFormType === FORM_TYPE.claim && <IncreaseAmount />}
        </div>
      </WriteFunctionalityContainer>
    </VeOlasContainer>
  );
};

VeOlas.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

VeOlas.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export default connect(mapStateToProps, null)(VeOlas);
