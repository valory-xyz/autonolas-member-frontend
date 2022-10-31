import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { getVeolasContract } from 'common-util/Contracts';
import { getToken } from '../common';
import {
  MiddleContent,
  BoxContainer,
  SectionHeader,
  Sections,
} from '../styles';

const VeOlas = ({ account, chainId }) => {
  const [balance, setBalance] = useState(null);
  const [votes, setVotesCount] = useState(null);

  useEffect(() => {
    if (account && chainId) {
      const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

      // get balance
      contract.methods
        .balanceOf(account)
        .call()
        .then((response) => {
          setBalance(response);
        })
        .catch((error) => {
          window.console.log('Error occured on fetching balance:');
          window.console.error(error);
        });

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
  }, [account, chainId]);

  const veOlasBalance = balance ? ethers.utils.formatEther(balance) : null;

  return (
    <BoxContainer>
      <MiddleContent>
        <SectionHeader>Balance</SectionHeader>

        <Sections>
          {getToken({ tokenName: 'veOLAS', token: veOlasBalance })}
          {getToken({ tokenName: 'Votes', token: votes })}
        </Sections>
      </MiddleContent>
    </BoxContainer>
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
