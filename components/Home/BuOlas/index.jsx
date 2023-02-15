import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd/lib';
import {
  fetchBuolasBalance,
  fetchReleasableAmount,
  fetchMapLockedBalances,
} from 'store/setup/actions';
import { getToken } from '../common';
import { withdrawRequest } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { BuOlasContainer, WriteFunctionalityContainer } from './styles';

const isLoading = false;

const BuOlas = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const buOlasBalance = useSelector(
    (state) => state?.setup?.buolasBalance || null,
  );
  const buolasReleasableAmount = useSelector(
    (state) => state?.setup?.buolasReleasableAmount || null,
  );
  const mappedBalances = useSelector(
    (state) => state?.setup?.buolasMappedBalances || null,
  );

  // balances
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  useEffect(() => {
    if (account && chainId) {
      dispatch(fetchBuolasBalance());
      dispatch(fetchMapLockedBalances());
      dispatch(fetchReleasableAmount());
    }
  }, [account, chainId]);

  const onWithdraw = async () => {
    if (account && chainId) {
      setIsWithdrawLoading(true);
      try {
        await withdrawRequest({ account, chainId });
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsWithdrawLoading(false);
      }
    }
  };

  const {
    amount, startTime, endTime, transferredAmount,
  } = mappedBalances || {};

  return (
    <BuOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>Balance Of</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Balance Of',
              token: buOlasBalance || '--',
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>Releasable Amount</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: buolasReleasableAmount || '--',
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>Locked Balances</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: amount || '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'Transferred Amount',
              token: transferredAmount || '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'Start Time',
              token: startTime ? new Date(startTime).toLocaleString() : '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'End Time',
              token: endTime ? new Date(endTime).toLocaleString() : '--',
              isLoading,
            })}
          </Sections>
        </MiddleContent>
      </div>

      <WriteFunctionalityContainer>
        <Button type="primary" onClick={onWithdraw} loading={isWithdrawLoading}>
          Withdraw
        </Button>
      </WriteFunctionalityContainer>
    </BuOlasContainer>
  );
};

export default BuOlas;
