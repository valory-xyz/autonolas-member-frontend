import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { getVeolasContract } from 'common-util/Contracts';
import {
  MiddleContent,
  BoxContainer,
  SectionHeader,
  Sections,
} from '../styles';

const VeOlas = ({ account, chainId }) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

      contract.methods
        .balanceOf(account)
        .call()
        .then((response) => {
          setBalance(response);
        })
        .catch((error) => {
          window.console.log('Error occured on fetching balance ', error);
        });
    }
  }, [account]);

  const veOlasBalance = balance ? ethers.utils.formatEther(balance) : null;

  return (
    <BoxContainer>
      <MiddleContent>
        <SectionHeader>Balance</SectionHeader>

        <Sections>
          <div className="section velos-section">
            <div className="info">
              <span className="token-name">veOLAS</span>
              <span className="balance">{veOlasBalance}</span>
            </div>
          </div>
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
