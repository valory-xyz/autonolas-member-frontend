import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { Radio } from 'antd/lib';
import { getVeolasContract } from 'common-util/Contracts';
import { getToken } from '../common';
import { CreateLock } from './WriteFunctionality';
import { fetchBalanceOf, fetchVotes } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { VeOlasContainer, WriteFunctionalityContainer } from './styles';

const VeOlas = ({ account, chainId }) => {
  const [balance, setBalance] = useState(null);
  const [votes, setVotesCount] = useState(null);
  const [currentFormType, setCurrentFormType] = useState('typeCreateLock');

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        try {
          const balanceResponse = await fetchBalanceOf({ account, chainId });
          setBalance(balanceResponse);

          const votesResponse = await fetchVotes({ account, chainId });
          setVotesCount(votesResponse);
        } catch (error) {
          window.console.error(error);
        }

        // get votes count
        const contract2 = getVeolasContract(window.MODAL_PROVIDER, chainId);
        contract2.methods
          .getVotes(account)
          .call()
          .then((response) => {
            setVotesCount(response);
          })
          .catch((error) => {
            window.console.log('Error occured on fetching votes:');
            window.console.error(error);
          });
      }
    };
    fn();
  }, [account, chainId]);

  const onChange = (e) => {
    window.console.log('radio checked', e.target.value);
    setCurrentFormType(e.target.value);
  };

  const veOlasBalance = balance ? ethers.utils.formatEther(balance) : null;
  const votesInEth = votes ? ethers.utils.formatEther(votes) : null;

  return (
    <VeOlasContainer>
      <MiddleContent className="balance-container">
        <SectionHeader>Balance</SectionHeader>

        <Sections>
          {/* TODO: need to be removed? */}
          <div style={{ display: 'none' }}>
            {getToken({ tokenName: 'veOLAS', token: veOlasBalance })}
          </div>

          {getToken({ tokenName: 'Votes', token: (+votesInEth).toFixed(4) })}
        </Sections>
      </MiddleContent>

      <WriteFunctionalityContainer>
        <Radio.Group onChange={onChange} value={currentFormType}>
          <Radio value="typeCreateLock">Create Lock</Radio>
          <Radio value="typeIncreaseAmount">Increase Amount</Radio>
          <Radio value="typeIncreaseUnlockTime">Increase Unlock Time</Radio>
          <Radio value="typeClaim">Claim</Radio>
        </Radio.Group>

        <div className="forms-container">
          {currentFormType === 'typeCreateLock' && <CreateLock />}
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
