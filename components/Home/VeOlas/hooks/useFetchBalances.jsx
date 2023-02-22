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
  const veolasBalance = useSelector((state) => state?.setup?.veolasBalance);
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

  const getData = () => {
    dispatch(fetchOlasBalance());
    dispatch(fetchVeolasDetails());
    dispatch(fetchMappedBalances());
    dispatch(fetchIfCanWithdrawVeolas());
  };

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          getData();
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
    veolasBalance,
    mappedAmount,
    mappedEndTime,
    isMappedAmountZero,
    votes,
    totalSupplyLocked,
    canWithdrawVeolas,
    getData,
  };
};
