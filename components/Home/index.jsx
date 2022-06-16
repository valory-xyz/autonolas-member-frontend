import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isNumber } from 'lodash';
import { CustomButton } from 'common-util/Button';
// import { getBalanceDetails } from './utils';
import { MiddleContent } from './styles';

const Home = ({ account }) => {
  if (!account) return null;
  const [tokens, setTokens] = useState({});

  useEffect(async () => {
    // const l = await getBalanceDetails(account);
    // console.log({ l });

    setTokens({});
  }, [account]);

  const handleClaim = () => {
    window.console.log('CLAIM');
  };

  const buOlas = get(tokens, 'veBalance');

  return (
    <MiddleContent>
      <div className="section left-section">
        <div className="info">
          <span className="token-name">buOLAS:</span>
          &nbsp;
          <span className="balance">{isNumber(buOlas) ? buOlas : 'NA'}</span>
        </div>

        <CustomButton
          variant={!buOlas ? 'disabled' : 'green'}
          disabled={!buOlas}
          onClick={handleClaim}
        >
          Claim buOLAS
        </CustomButton>
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
