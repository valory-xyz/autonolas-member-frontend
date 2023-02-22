import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isNil, isString } from 'lodash';
import { NA } from 'common-util/constants';
import {
  getFormattedDate,
  formatToEth,
  getTotalVotesPercentage,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import {
  fetchOlasBalance,
  fetchIfCanWithdrawVeolas,
  fetchMappedBalances,
  fetchVeolasDetails,
} from 'store/setup/actions';

export const useFetchBalances = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const veolasBalance = useSelector((state) => state?.setup?.veolasBalance);
  const mappedAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.amount || null,
  );
  const mappedEndTime = useSelector(
    (state) => state?.setup?.mappedBalances?.endTime || null,
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
    veolasBalance,
    mappedAmount,
    mappedEndTime,
    votes,
    totalSupplyLocked,
    canWithdrawVeolas,
    getData,
  };
};

/**
 * This hook is used to get the components
 */
export const useVeolasComponents = () => {
  const {
    isLoading,
    veolasBalance,
    votes,
    totalSupplyLocked,
    mappedAmount,
    mappedEndTime,
  } = useFetchBalances();

  const getString = (x) => {
    if (isNil(x)) return NA;
    return isString(x) ? x : `${x}`;
  };

  const getVotingPowerComponent = (title) => (
    <InfoCard
      title={title || 'Voting power'}
      value={getString(formatToEth(votes))}
      subText="votes"
    />
  );

  const getVotingPercentComponent = () => (
    <InfoCard
      value={
        Number(votes) === 0 || Number(totalSupplyLocked) === 0
          ? '0%'
          : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`
      }
      subText="% of total voting power"
    />
  );

  const getBalanceComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Your balance'}
      value={getString(veolasBalance)}
      subText="veOLAS"
    />
  );

  const getLockedAmountComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Lock'}
      value={getString(mappedAmount)}
      subText="locked OLAS"
    />
  );

  const getUnlockTimeComponent = () => (
    <InfoCard
      isLoading={isLoading}
      value={getFormattedDate(mappedEndTime)}
      subText="unlock date"
    />
  );

  return {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
  };
};
