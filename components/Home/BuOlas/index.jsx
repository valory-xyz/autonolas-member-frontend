import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import get from 'lodash/get';
import { getToken } from '../common';
import { fetchMapLockedBalances, fetchReleasableAmount } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { BuOlasContainer } from './styles';

const BuOlas = ({ account, chainId }) => {
  const [mappedBalances, setMappedBalances] = useState(null);
  const [releasableAmount, setReleasableAmount] = useState(null);

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        try {
          const values = await fetchMapLockedBalances({
            account,
            chainId,
          });
          setMappedBalances(values);

          const rAmount = await fetchReleasableAmount({
            account,
            chainId,
          });
          setReleasableAmount(rAmount);
        } catch (error) {
          window.console.error(error);
        }
      }
    };
    fn();
  }, [account, chainId]);

  const {
    amount, startTime, endTime, transferredAmount,
  } = mappedBalances || {};

  return (
    <BuOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>mapLockedBalances</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: amount || '--',
            })}
            {getToken({
              tokenName: 'transferredAmount',
              token: transferredAmount || '--',
            })}
            {getToken({
              tokenName: 'startTime',
              token: startTime ? new Date(startTime).toLocaleString() : '--',
            })}
            {getToken({
              tokenName: 'endTime',
              token: endTime ? new Date(endTime).toLocaleString() : '--',
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>releasableAmount</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: releasableAmount || '--',
            })}
          </Sections>
        </MiddleContent>
      </div>
    </BuOlasContainer>
  );
};

BuOlas.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

BuOlas.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export default connect(mapStateToProps, null)(BuOlas);
