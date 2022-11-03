import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Radio, Statistic } from 'antd/lib';
import { getToken } from '../common';
import { CreateLock } from './WriteFunctionality';
import {
  fetchVotes,
  fetchTotalSupplyLocked,
  fetchMapLockedBalances,
} from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { VeOlasContainer, WriteFunctionalityContainer } from './styles';

const { Countdown } = Statistic;

const VeOlas = ({ account, chainId }) => {
  const [votes, setVotesCount] = useState(null);
  const [totalSupplyLocked, setTotalSupplyLocked] = useState(null);
  const [mappedAmount, setMappedAmount] = useState(null);
  const [mappedEndTime, setMappedEndTime] = useState(null);
  const [currentFormType, setCurrentFormType] = useState('typeCreateLock');

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
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

  //

  //

  //

  return (
    <VeOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>veOLAS Balance</SectionHeader>
          <Sections>
            {getToken({ tokenName: 'Votes', token: votes })}
            {getToken({
              tokenName: 'Total Voting power',
              token: totalSupplyLocked,
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>Locked OLAS</SectionHeader>
          <Sections>
            {getToken({ tokenName: 'Amount', token: mappedAmount })}
            {getToken({
              tokenName: 'Unlocking time',
              token: (
                <>
                  <Countdown value={mappedEndTime} format="MM DD HH:mm:ss" />
                </>
              ),
            })}
          </Sections>
        </MiddleContent>
      </div>

      <WriteFunctionalityContainer>
        <Radio.Group onChange={onChange} value={currentFormType}>
          <Radio value="typeCreateLock">Create Lock</Radio>
          <Radio value="typeIncreaseAmount">Increase Amount</Radio>
          <Radio value="typeIncreaseUnlockTime">Increase Unlock Time</Radio>
          <Radio value="typeClaim">Claim</Radio>
        </Radio.Group>

        <div className="forms-container">
          {currentFormType === 'typeCreateLock' && (
            <CreateLock account={account} chainId={chainId} />
          )}
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
