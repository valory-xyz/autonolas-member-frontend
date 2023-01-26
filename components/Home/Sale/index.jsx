import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from 'next/image';
import { notification } from 'antd/lib';
import { get } from 'lodash';
import {
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
} from 'store/setup/actions';
import { CustomButton } from 'common-util/Button';
import { getBalance } from 'common-util/functions';
import { getSaleContract } from 'common-util/Contracts';
import AlertInfo from 'components/AlertInfo';
import { COLOR } from 'util/theme';
import { getToken } from '../common';
import { claimableBalancesRequest } from './utils';
import {
  BoxContainer,
  MiddleContent,
  Sections,
  SectionHeader,
  SectionFooter,
} from '../styles';

const CONNECT_WALLET_MESSAGE = 'To see balances and claim them, connect wallet';
const GNOSIS_DESKTOP_MESSAGE = 'If claiming via Gnosis Safe on desktop, complete transaction there and refresh here to see updated balances.';
const TRANSACTION_STATE = {
  success: 'success',
  failure: 'failure',
};

const Sale = ({
  account, chainId, setUserBalance, setErrorMessage,
}) => {
  const [isClaimLoading, setClaimLoading] = useState(false);
  const [transactionState, setTransactionState] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [tokens, setTokens] = useState(null);

  const getOlasBalance = async () => {
    if (account && chainId) {
      const temp = await claimableBalancesRequest({ account, chainId });
      setTokens(temp);
    }
  };

  useEffect(() => {
    getOlasBalance();
  }, [account, chainId]);

  const setBalance = async (accountPassed) => {
    try {
      const result = await getBalance(accountPassed, window.MODAL_PROVIDER);
      setUserBalance(result);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleClaim = async () => {
    setClaimLoading(true);

    const contract = getSaleContract(window.MODAL_PROVIDER, chainId);

    contract.methods
      .claim()
      .send({ from: account })
      .then((response) => {
        // if claim is successfully done, transition to SUCCESS state!
        setTransactionState(TRANSACTION_STATE.success);
        setTransactionId(get(response, 'transactionHash') || null);

        // SHOW SUCCESS NOTIFICATION
        notification.success({
          description: 'Transaction Successful',
          style: { border: `1px solid ${COLOR.PRIMARY}` },
        });

        /* re-fetch tokens, balance after 3 seconds */
        setTimeout(async () => {
          await setBalance(account);
          getOlasBalance();
        }, 3000);
      })
      .catch((error) => {
        console.error(error);

        // SHOW ERROR NOTIFICATION
        notification.error({
          description: 'Some error occured',
          style: { border: `1px solid ${COLOR.RED}` },
        });

        // if claim is unsuccessful, transition to FAILURE state!
        setTransactionState(TRANSACTION_STATE.failure);
      })
      .finally(() => {
        setClaimLoading(false);
      });
  };

  const bToken = get(tokens, 'buBalance');
  const buOlas = bToken ? ethers.utils.formatEther(bToken) : null;

  const vToken = get(tokens, 'veBalance');
  const veOlas = bToken ? ethers.utils.formatEther(vToken) : null;

  /**
   * disabled, iff token
   * 1. no account (not logged-in)
   * 2. token is empty (maybe 0)
   * 3. disable the button completely even if the transaction is successful
   *    so the user can't click more than once
   */
  const isDisabled = isClaimLoading
    || transactionState === TRANSACTION_STATE.success
    || !account
    || !veOlas
    || !buOlas
    || (veOlas === '0.0' && buOlas === '0.0');

  return (
    <BoxContainer>
      <MiddleContent>
        <SectionHeader>Claimable balances</SectionHeader>

        <Sections className="sections">
          {getToken({ tokenName: 'veOLAS', token: veOlas })}
          {getToken({ tokenName: 'buOLAS', token: buOlas })}
        </Sections>

        <CustomButton
          variant={isDisabled ? 'disabled' : 'green'}
          disabled={isDisabled}
          onClick={handleClaim}
          loading={isClaimLoading}
        >
          Claim
        </CustomButton>

        {!account && <SectionFooter>{CONNECT_WALLET_MESSAGE}</SectionFooter>}
      </MiddleContent>

      {account && (
        <>
          <br />
          <AlertInfo
            transactionState={transactionState}
            chainId={chainId}
            transactionId={transactionId}
          />
        </>
      )}

      <br />
      <MiddleContent>
        <Image width={50} height={50} src="/images/gnosis-logo.svg" />
        <SectionFooter>{GNOSIS_DESKTOP_MESSAGE}</SectionFooter>
      </MiddleContent>
    </BoxContainer>
  );
};

Sale.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
};

Sale.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

const mapDispatchToProps = {
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sale);
