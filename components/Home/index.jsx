import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Alert } from 'antd';
import { CustomButton } from 'common-util/Button';
import { getBalance } from 'common-util/functions';
import {
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
} from 'store/setup/actions';
import { EthersProviderProptype } from 'common-util/ReusableProptypes';
import { Ellipsis } from 'components/GlobalStyles';
import { getBalanceDetails, claimBalances } from './utils';
import { getUrl, getToken } from './helpers';
import { Container, MiddleContent, TransactionSuccessMessage } from './styles';

const CONNECT_WALLET_MESSAGE = 'To see balances and claim them, connect wallet';
const TRANSACTION_STATE = {
  success: 'success',
  failure: 'failure',
};

const Home = ({
  account,
  chainId,
  setUserBalance,
  setErrorMessage,
  web3Provider,
}) => {
  const [tokens, setTokens] = useState({});
  const [isClaimLoading, setClaimLoading] = useState(false);
  const [transactionState, setTransactionState] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const setBalance = async (accountPassed) => {
    try {
      const result = await getBalance(accountPassed, web3Provider);
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

    // if no account, balance should be reset
    if (!account) {
      setTokens({});
    }
  }, [account, web3Provider]);

  const handleClaim = async () => {
    setClaimLoading(true);
    try {
      const response = await claimBalances(account, web3Provider);

      // if claim is successfully done, transition to SUCCESS state!
      setTransactionState(TRANSACTION_STATE.success);
      setTransactionId(get(response, 'hash') || null);

      /* re-fetch tokens, balance after 3 seconds */
      setTimeout(async () => {
        await getTokens();
        await setBalance(account);
      }, 3000);
    } catch (error) {
      console.error(error);

      // if claim is unsuccessful, transition to FAILURE state!
      setTransactionState(TRANSACTION_STATE.failure);
    } finally {
      setClaimLoading(false);
    }
  };

  const bToken = get(tokens, 'buBalance');
  const buOlas = bToken ? ethers.utils.formatEther(bToken) : null;

  const vToken = get(tokens, 'veBalance');
  const veOlas = bToken ? ethers.utils.formatEther(vToken) : null;

  /**
   * disabled, iff token
   * 1. no account (not logged-in)
   * 2. token is empty (maybe 0)
   */
  const isDisabled = isClaimLoading
    || !account
    || !veOlas
    || !buOlas
    || (veOlas === '0.0' && buOlas === '0.0');

  return (
    <Container>
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

      <br />

      {transactionState === TRANSACTION_STATE.success && (
        <Alert
          type="info"
          message={(
            <TransactionSuccessMessage>
              <div>Transaction Submitted</div>
              <div className="t-id">
                Track on Etherscan:&nbsp;
                <a
                  href={getUrl(chainId, transactionId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ropsten-transaction"
                >
                  <Ellipsis>{transactionId}</Ellipsis>
                  <span className="external-link">
                    <Image
                      src="/images/external-link.svg"
                      alt="Transaction link"
                      width={18}
                      height={16}
                    />
                  </span>
                </a>
              </div>
            </TransactionSuccessMessage>
          )}
        />
      )}

      {transactionState === TRANSACTION_STATE.failure && (
        <Alert
          message="Claim transaction failed – try again"
          type="error"
          showIcon
        />
      )}
    </Container>
  );
};

Home.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  web3Provider: EthersProviderProptype,
};

Home.defaultProps = {
  account: null,
  chainId: null,
  web3Provider: null,
};

const mapStateToProps = (state) => {
  const { account, chainId, web3Provider } = state.setup;
  return { account, chainId, web3Provider };
};

const mapDispatchToProps = {
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
