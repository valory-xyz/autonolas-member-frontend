import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd/lib';
import {
  // fetchTotalSupplyOfOlas,

  mintOlas, fetchBalanceOfOlas,
} from './utils';

export const TestingContainer = styled.div`
  border: 1px solid black;
  border-radius: 12px;
`;

const TestSection = ({ account, chainId }) => {
  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        try {
          // await fetchTotalSupplyOfOlas({ chainId });

          await fetchBalanceOfOlas({ account, chainId });
        } catch (error) {
          window.console.error(error);
        }
      }
    };
    fn();
  }, [account, chainId]);

  return (
    <div>
      <Button
        onClick={async () => {
          await mintOlas({ account, chainId });
          await fetchBalanceOfOlas({ account, chainId });
        }}
        disabled={!account || !chainId}
      >
        Mint OLAS
      </Button>
    </div>
  );
};

TestSection.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

TestSection.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export default connect(mapStateToProps, null)(TestSection);
