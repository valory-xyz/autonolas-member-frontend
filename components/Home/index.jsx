import { useEffect, useState } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { CustomButton } from 'common-util/Button';
import { getBalanceDetails, claimBalances } from './utils';

import { MiddleContent } from './styles';

const Home = ({ account }) => {
  if (!account) return null;
  const [tokens, setTokens] = useState({});
  const [isClaimLoading, setClaimLoading] = useState(false);

  const getTokens = async () => {
    try {
      const balances = await getBalanceDetails(account);
      setTokens(balances);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    getTokens();
  }, [account]);

  const handleClaim = async () => {
    setClaimLoading(true);
    try {
      await claimBalances(account);
      setTimeout(getTokens, 2000); /* re-fetch tokens after 2 seconds */
    } catch (error) {
      console.error(error);
    } finally {
      setClaimLoading(false);
    }
  };

  const getToken = ({ tokenName, token }) => {
    const value = token ? Web3.utils.fromWei(token.toString(), 'ether') : 'NA';

    // const dd = new Web3.utils.BN(
    //   Web3.utils.toWei(token.toString(), 'ether'),
    // );
    console.log({ value, dd: null });
    return (
      <div className={`section ${tokenName}-section`}>
        <div className="info">
          <span className="token-name">{`Claimable ${tokenName}:`}</span>
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
      <div className="sections">
        {getToken({ tokenName: 'veOlas', token: veOlas })}
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
    </MiddleContent>
  );
};

Home.propTypes = {
  account: PropTypes.string,
};

Home.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const { account } = state.setup;
  return { account };
};

export default connect(mapStateToProps, {})(Home);
