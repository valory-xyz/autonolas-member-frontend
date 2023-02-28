import {
  getFormattedDate,
  formatToEth,
  getTotalVotesPercentage,
  getFormattedNumber,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { useFetchBalances } from './useFetchBalances';

/**
 * 1. unlocked OLAS = balanceOf(amount) of veOlas contract
 *
 *
 * 2. Relock should be enabled only if withdraw is completed
 *
 */

/**
 * This hook is used to get the components
 */
export const useVeolasComponents = () => {
  const {
    isLoading,
    olasBalanceInEth,
    veolasBalance,
    votes,
    totalSupplyLocked,
    mappedAmount,
    mappedEndTime,
  } = useFetchBalances();

  const getBalanceComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Your balance'}
      value={getFormattedNumber(olasBalanceInEth)}
      subText="OLAS"
    />
  );

  const getVotingPowerComponent = (title) => (
    <InfoCard
      title={title || 'Voting power'}
      value={getFormattedNumber(formatToEth(votes))}
      subText="veOLAS"
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

  const getLockedAmountComponent = ({ title = 'Lock', hideTitle = false } = {}) => (
    <InfoCard
      isLoading={isLoading}
      title={title}
      hideTitle={hideTitle}
      value={getFormattedNumber(mappedAmount)}
      subText="locked OLAS"
    />
  );

  const getUnlockTimeComponent = (
    { hideTitle = false } = {},
  ) => (
    <InfoCard
      isLoading={isLoading}
      hideTitle={hideTitle}
      value={getFormattedDate(mappedEndTime)}
      subText="unlock date"
    />
  );

  // TODO: how to fetch this data?
  const getUnlockedAmountComponent = () => (
    <InfoCard
      isLoading={isLoading}
      value={getFormattedNumber(veolasBalance)}
      subText="unlocked OLAS"
      style={{ display: 'none' }}
    />
  );

  return {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
    getUnlockedAmountComponent,
  };
};

/**
 * 1st section -
 *   it should be "OLAS"
 *   balance should be of OLAS
 *
 *
 * =>
 */
