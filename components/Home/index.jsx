import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isNumber } from 'lodash';
import { CustomButton } from 'common-util/Button';
import {
  // getOlasDetails,
  // getBuOlasDetails,
  getVeOlasDetails,
  // getBalanceDetails,
  // getAgents,
} from './utils';

import { MiddleContent } from './styles';

const Home = ({ account }) => {
  if (!account) return null;
  const [tokens, setTokens] = useState({});

  useEffect(async () => {
    // const l = await getBalanceDetails(account);
    // console.log({ l });

    // const agents = await getAgents(account);
    // console.log({ agents });

    // const olas = await getOlasDetails(account);
    // console.log({ olas });

    // const buOlas = await getBuOlasDetails(account);
    // console.log({ buOlas });

    const veOlas = await getVeOlasDetails(account);
    console.log({ veOlas });

    setTokens({});
  }, [account]);

  const handleClaim = () => {
    window.console.log('CLAIM');
  };

  const getToken = ({ tokenName, token }) => (
    <>
      <div className="info">
        <span className="token-name">{`${tokenName}:`}</span>
        <span className="balance">{isNumber(token) ? token : 'NA'}</span>
      </div>

      <CustomButton
        variant={!token ? 'disabled' : 'green'}
        disabled={!token}
        onClick={handleClaim}
      >
        {`Claim ${tokenName}`}
      </CustomButton>
    </>
  );

  const veOlas = get(tokens, 'veBalance');
  const buOlas = get(tokens, 'buBalance');

  return (
    <MiddleContent>
      <div className="section left-section">
        {getToken({ tokenName: 'veOlas', token: veOlas })}
      </div>
      <div className="section right-section">
        {getToken({ tokenName: 'buOLAS', token: buOlas })}
      </div>
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
