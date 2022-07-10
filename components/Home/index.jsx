import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { CustomButton } from 'common-util/Button';
import { getBalance } from 'common-util/functions';
import {
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
} from 'store/setup/actions';
import { EthersProviderProptype } from 'common-util/ReusableProptypes';
import { getBalanceDetails, claimBalances } from './utils';
import { MiddleContent } from './styles';

const CONNECT_WALLET_MESSAGE = 'To see balances and claim them, connect wallet';

const Home = ({
  account, setUserBalance, setErrorMessage, web3Provider,
}) => {
  const [tokens, setTokens] = useState({});
  const [isClaimLoading, setClaimLoading] = useState(false);

  const setBalance = async (accountPassed) => {
    try {
      const result = await getBalance(accountPassed);
      setUserBalance(result);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const getTokens = async () => {
    try {
      const balances = await getBalanceDetails(account, web3Provider);
      setTokens(balances);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (account && web3Provider) {
      getTokens();
    }
  }, [account, web3Provider]);

  const handleClaim = async () => {
    setClaimLoading(true);
    try {
      await claimBalances(account, web3Provider);

      /* re-fetch tokens, balance after 2 seconds */
      setTimeout(async () => {
        await getTokens();
        await setBalance(account);
        setClaimLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setClaimLoading(false);
    }
  };

  const getToken = ({ tokenName, token }) => {
    const value = token ? ethers.utils.formatEther(token) : '--';
    return (
      <div className={`section ${tokenName}-section`}>
        <div className="info">
          <span className="token-name">{tokenName}</span>
          <span className="balance">{value}</span>
        </div>
      </div>
    );
  };

  const veOlas = get(tokens, 'veBalance');
  const buOlas = get(tokens, 'buBalance');

  /**
   * disabled, iff token
   * 1. no account (not logged-in)
   * 2. token is empty (maybe 0)
   */
  const isDisabled = !account || !veOlas || !buOlas || veOlas === '0' || buOlas === '0';

  return (
    <MiddleContent>
      <h2 className="section-header">Claimable assets</h2>

      <div className="sections">
        {getToken({ tokenName: 'veOLAS', token: veOlas })}
        {getToken({ tokenName: 'buOLAS', token: buOlas })}
      </div>

      <CustomButton
        variant={isDisabled ? 'disabled' : 'green'}
        disabled={isDisabled}
        onClick={handleClaim}
        loading={isClaimLoading}
      >
        Claim
      </CustomButton>

      {!account && (
        <div className="section-footer">{CONNECT_WALLET_MESSAGE}</div>
      )}
    </MiddleContent>
  );
};

Home.propTypes = {
  account: PropTypes.string,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  web3Provider: EthersProviderProptype,
};

Home.defaultProps = {
  account: null,
  web3Provider: null,
};

const mapStateToProps = (state) => {
  const { account, web3Provider } = state.setup;
  return { account, web3Provider };
};

const mapDispatchToProps = {
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
