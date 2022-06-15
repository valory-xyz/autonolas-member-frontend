import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import round from 'lodash/round';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { CHAIN_ID, CONSTANTS, METAMASK_ERROR_MSG } from 'util/constants';
import Warning from 'common-util/SVGs/warning';
import { getBalance } from 'common-util/functions';
import { CustomButton } from 'common-util/Button';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
  setLoaded as setLoadedFn,
} from 'store/setup/actions';
import { Container, DetailsContainer, MetamaskContainer } from './styles';

const Login = ({
  isLoaded,
  account,
  balance,
  errorMessage,
  setUserAccount,
  setUserBalance,
  setErrorMessage,
  setLoaded,
}) => {
  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const setBalance = async (accountPassed) => {
    try {
      const result = await getBalance(accountPassed);
      setUserBalance(result);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(async () => {
    if (account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      const isValid = CHAIN_ID.includes(Number(chainId));
      setIsNetworkSupported(isValid);
    }
  }, [account]);

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // remove `disconnect` from localStorage
      localStorage.setItem(CONSTANTS.IS_CONNECTED, 'true');

      window.ethereum
        .request({ method: CONSTANTS.ETH_REQUESTACCOUNTS })
        .then((result) => {
          // setting only the 1st account
          setUserAccount(result[0]);
          setBalance(result[0]);
        })
        .catch((e) => {
          const code = get(e, 'code');
          if (code === -32002) {
            setErrorMessage('Wallet connection pending');
          } else if (code === 4001 || code === -32602) {
            /**
             * 4001: user denied access to metamask, so no need to set error!
             * -32602: user disconnected from connected sites option in metamask!
             */
            setErrorMessage(null);
          } else {
            setErrorMessage(e.message);
          }
        });
    } else {
      setErrorMessage(METAMASK_ERROR_MSG);
    }
  };

  // set `disconnect` to localStorage for reference
  const handleDisconnect = () => {
    localStorage.setItem(CONSTANTS.IS_CONNECTED, 'false');
    setLoaded(false);
    setUserAccount(null);
    setUserBalance(null);
  };

  /**
   * if already loaded (ie. logged in before and present in localStorage),
   * set account and balance of the user as we don't store the user details.
   */
  useEffect(() => {
    if (isLoaded && !account) {
      handleLogin();
    }
  }, [isLoaded]);

  /**
   * listener for account, chain changes
   */
  const handleAccountChange = (newAccount) => {
    setUserAccount(newAccount);
    setBalance(newAccount.toString());
    setErrorMessage(null);
    window.location.reload();
  };

  // reload the page to on chain change to avoid errors
  const handleChainChange = () => {
    window.location.reload();
  };

  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountChange);
    window.ethereum.on('chainChanged', handleChainChange);
  }

  if (errorMessage) {
    return (
      <Container>
        <MetamaskContainer data-testid="login-error">
          {errorMessage}
        </MetamaskContainer>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container>
        <CustomButton
          variant="green"
          onClick={handleLogin}
          data-testid="connect-metamask"
        >
          Connect MetaMask
        </CustomButton>
      </Container>
    );
  }

  return (
    <Container>
      <DetailsContainer>
        <MetamaskContainer>
          {!isNetworkSupported && (
            <div className="unsupported-network">
              <Warning />
              Unsupported network
            </div>
          )}
          <div>{isNil(balance) ? '--' : `${round(balance, 2)} ETH`}</div>
          <div className="dash" />
          <div className="address">{account ? `${account}` : 'NA'}</div>
          <CustomButton variant="red" onClick={handleDisconnect}>
            Disconnect
          </CustomButton>
        </MetamaskContainer>
      </DetailsContainer>
    </Container>
  );
};

Login.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  account: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLoaded: PropTypes.func.isRequired,
};

Login.defaultProps = {
  account: null,
  balance: null,
  errorMessage: null,
};

const mapStateToProps = (state) => {
  const {
    isLoaded, account, balance, errorMessage,
  } = get(state, 'setup', {});
  return {
    isLoaded,
    account,
    balance,
    errorMessage,
  };
};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
  setLoaded: setLoadedFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
