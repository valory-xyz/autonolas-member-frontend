import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import round from 'lodash/round';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { CHAIN_ID } from 'util/constants';
import Warning from 'common-util/SVGs/warning';
import { getBalance } from 'common-util/functions';
import { CustomButton } from 'common-util/Button';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
} from 'store/setup/actions';
import { isString } from 'lodash';
import { Container, DetailsContainer, WalletContainer } from './styles';
import { provider } from './Helpers';

const Login = ({
  account,
  balance,
  errorMessage,
  setUserAccount,
  setUserBalance,
  setErrorMessage,
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
      const isValid = CHAIN_ID.includes(Number(provider.chainId));
      setIsNetworkSupported(isValid);
      setBalance(account);
    }
  }, [account]);

  const handleLogin = async () => {
    try {
      const accounts = await provider.enable();
      setUserAccount(accounts[0]);
    } catch (error) {
      if (!get(error, 'message') === 'User closed modal') {
        setErrorMessage(isString(error) ? error : JSON.stringify(error));
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await provider.disconnect();
      setUserAccount(null);
      setUserBalance(null);
    } catch (error) {
      window.console.log({
        message: 'Something went wrong while disconnecting the wallet',
        error,
      });
    }
  };

  /**
   * "Wallect Connect" on login, places a key in the localStorage as
   * `walletconnect` & on disconnect it is removed from the localStorage.
   *  Hence, if it is present, call `handleLogin` & set account and balance.
   */
  useEffect(() => {
    if (localStorage.getItem('walletconnect')) {
      handleLogin();
    }
  }, []);

  if (typeof window !== 'undefined' && provider.connected) {
    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts) => {
      setUserAccount(accounts[0]);
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId) => {
      const isValid = CHAIN_ID.includes(chainId);
      setIsNetworkSupported(isValid);
    });

    // Subscribe to session disconnection
    provider.on('disconnect', () => {
      setUserAccount(null);
      setUserBalance(null);
    });
  }

  if (errorMessage) {
    return (
      <Container>
        <WalletContainer data-testid="login-error">
          {errorMessage}
        </WalletContainer>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container>
        <CustomButton variant="green" onClick={handleLogin}>
          Connect Wallet
        </CustomButton>
      </Container>
    );
  }

  return (
    <Container>
      <DetailsContainer>
        <WalletContainer>
          {!isNetworkSupported && (
            <div className="unsupported-network">
              <Warning />
              Unsupported network
            </div>
          )}
          <div>{isNil(balance) ? '--' : `${round(balance, 2)} ETH`}</div>
          <div className="dash" />
          <div className="address">{account ? `${account}` : 'NA'}</div>
          <CustomButton variant="transparent" onClick={handleDisconnect}>
            Disconnect
          </CustomButton>
        </WalletContainer>
      </DetailsContainer>
    </Container>
  );
};

Login.propTypes = {
  account: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
};

Login.defaultProps = {
  account: null,
  balance: null,
  errorMessage: null,
};

const mapStateToProps = (state) => {
  const { account, balance, errorMessage } = get(state, 'setup', {});
  return {
    account,
    balance,
    errorMessage,
  };
};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
