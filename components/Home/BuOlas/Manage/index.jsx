import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'antd/lib';
import { fetchBuolasDetails } from 'store/setup/actions';
import { getToken } from '../../common';
import { withdrawRequest } from './utils';
import { MiddleContent, Sections } from '../../styles';
import { BuOlasContainer, WriteFunctionalityContainer } from '../styles';

const getTime = (seconds) => (seconds ? new Date(seconds).toLocaleDateString() : '--');

export const BuolasManage = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const buolasBalance = useSelector(
    (state) => state?.setup?.buolasBalance || null,
  );
  const buolasReleasableAmount = useSelector(
    (state) => state?.setup?.buolasReleasableAmount || null,
  );
  const mappedBalances = useSelector(
    (state) => state?.setup?.buolasMappedBalances || null,
  );
  const buolasNextReleasableAmount = useSelector(
    (state) => state?.setup?.buolasNextReleasableAmount || null,
  );
  const buolasNextReleasableTime = useSelector(
    (state) => state?.setup?.buolasNextReleasableTime || null,
  );

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

  return (
    <BuOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <Sections>
            {getToken({
              tokenName: 'Balance',
              token: buolasBalance || '--',
            })}
            {getToken({
              tokenName: 'Vesting time',
              token: getTime(mappedBalances?.startTime),
            })}
            {getToken({
              tokenName: 'Time to vest',
              token: getTime(mappedBalances?.endTime),
            })}
            {getToken({
              tokenName: 'Vested amount',
              token: buolasReleasableAmount || '--',
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <Sections>
            {getToken({
              tokenName: 'Next Vesting amount',
              token: buolasNextReleasableAmount || '--',
            })}
            {getToken({
              tokenName: 'Next Vesting time',
              token: getTime(buolasNextReleasableTime),
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
