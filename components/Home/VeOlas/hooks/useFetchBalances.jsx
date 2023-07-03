import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchOlasBalance,
  fetchIfCanWithdrawVeolas,
  fetchMappedBalances,
  fetchVeolasDetails,
} from 'store/setup/actions';
import { parseToEth } from 'common-util/functions';

export const useFetchBalances = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const olasBalance = useSelector((state) => state?.setup?.olasBalance);
  const olasBalanceInEth = olasBalance ? parseToEth(olasBalance) : '0';
  const hasNoOlasBalance = Number(olasBalance || '0') === 0;
  const lockedVeolas = useSelector((state) => state?.setup?.lockedVeolas);
  const mappedAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.amount || null,
  );
  const mappedEndTime = useSelector(
    (state) => state?.setup?.mappedBalances?.endTime || null,
  );
  const isMappedAmountZero = useSelector(
    (state) => state?.setup?.mappedBalances?.isMappedAmountZero || false,
  );
  const votes = useSelector((state) => state?.setup?.votes || null);
  const totalSupplyLocked = useSelector(
    (state) => state?.setup?.totalSupplyLocked || null,
  );
  const canWithdrawVeolas = useSelector(
    (state) => state?.setup?.canWithdrawVeolas,
  );

  const [isLoading, setIsLoading] = useState(!!account);

  const getData = async () => {
    await dispatch(fetchOlasBalance());
    await dispatch(fetchVeolasDetails());
    await dispatch(fetchMappedBalances());
    await dispatch(fetchIfCanWithdrawVeolas());
  };

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          await getData();
        } catch (error) {
          window.console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fn();
  }, [account, chainId]);

  return {
    isLoading,
    account,
    chainId,
    olasBalance,
    hasNoOlasBalance,
    olasBalanceInEth,
    lockedVeolas,
    mappedAmount,
    mappedEndTime,
    isMappedAmountZero,
    votes,
    totalSupplyLocked,
    canWithdrawVeolas,
    getData,
  };
};
