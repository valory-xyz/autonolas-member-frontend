import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'antd/lib';
import { fetchBuolasDetails } from 'store/setup/actions';
import { getToken } from '../../common';
import { withdrawRequest } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../../styles';
import { BuOlasContainer, WriteFunctionalityContainer } from '../styles';

const getTime = (seconds) => (seconds ? new Date(seconds).toLocaleDateString() : '--');

export const BuolasManage = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const buolasBalance = useSelector(
    (state) => state?.setup?.buolasBalance || null,
  );
  const lockedEnd = useSelector(
    (state) => state?.setup?.buolasLockedEnd || null,
  );
  const buolasReleasableAmount = useSelector(
    (state) => state?.setup?.buolasReleasableAmount || null,
  );
  // const buolasReleasableAmount = '0.0';
  const mappedBalances = useSelector(
    (state) => state?.setup?.buolasMappedBalances || null,
  );

  // balances
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  useEffect(() => {
    if (account && chainId) {
      dispatch(fetchBuolasDetails());
    }
  }, [account, chainId]);

  const onWithdraw = async () => {
    if (account && chainId) {
      setIsWithdrawLoading(true);
      try {
        await withdrawRequest({ account, chainId });
        dispatch(fetchBuolasDetails());
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
          <SectionHeader>Balance Of & Locked End</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Balance Of',
              token: buolasBalance || '--',
            })}
            {getToken({
              tokenName: 'Locked End',
              token: getTime(lockedEnd),
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
            })}
            {getToken({
              tokenName: 'Transferred Amount',
              token: transferredAmount || '--',
            })}
            {getToken({
              tokenName: 'Start Time',
              token: getTime(startTime),
            })}
            {getToken({
              tokenName: 'End Time',
              token: getTime(endTime),
            })}
          </Sections>
        </MiddleContent>
      </div>

      {/* show Withdraw button only if releasable amount > 0 */}
      <WriteFunctionalityContainer>
        <Button
          type="primary"
          disabled={isWithdrawLoading || buolasReleasableAmount <= 0}
          onClick={onWithdraw}
          loading={isWithdrawLoading}
        >
          Withdraw
        </Button>
        {buolasReleasableAmount <= 0 && (
          <Alert
            message="You have no releasable amount to withdraw"
            type="warning"
          />
        )}
      </WriteFunctionalityContainer>
    </BuOlasContainer>
  );
};
