import {
  getFormattedDate,
  formatToEth,
  getTotalVotesPercentage,
  getFormattedNumber,
  getFullFormattedDate,
  getCommaSeparatedNumber,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { useFetchBalances } from './useFetchBalances';

/**
 * This hook is used to get the components
 */
export const useVeolasComponents = () => {
  const {
    isLoading,
    olasBalanceInEth,
    lockedVeolas,
    votes,
    totalSupplyLocked,
    mappedAmount,
    mappedEndTime,
    canWithdrawVeolas,
  } = useFetchBalances();

  const getBalanceComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Your balance'}
      value={getFormattedNumber(olasBalanceInEth)}
      tooltipValue={getCommaSeparatedNumber(olasBalanceInEth)}
      subText="OLAS"
    />
  );

  const getVotingPowerComponent = (title) => (
    <InfoCard
      isLoading={isLoading}
      title={title || 'Voting power'}
      value={getFormattedNumber(formatToEth(votes))}
      tooltipValue={getCommaSeparatedNumber(formatToEth(votes))}
      subText="veOLAS"
    />
  );

  const getVotingPercentComponent = () => (
    <InfoCard
      isLoading={isLoading}
      value={
        Number(votes) === 0 || Number(totalSupplyLocked) === 0
          ? '0%'
          : `${getTotalVotesPercentage(votes, totalSupplyLocked)}%`
      }
      subText="% of total voting power"
    />
  );

  const getLockedAmountComponent = ({
    title = 'Lock',
    hideTitle = false,
  } = {}) => (
    <InfoCard
      isLoading={isLoading}
      title={title}
      hideTitle={hideTitle}
      value={getFormattedNumber(mappedAmount)}
      tooltipValue={getCommaSeparatedNumber(mappedAmount)}
      subText="locked OLAS"
    />
  );

  const getUnlockTimeComponent = ({ hideTitle = false } = {}) => (
    <InfoCard
      isLoading={isLoading}
      hideTitle={hideTitle}
      value={getFormattedDate(mappedEndTime)}
      tooltipValue={getFullFormattedDate(mappedEndTime)}
      subText="unlock date"
    />
  );

  // unlocked OLAS = balanceOf(amount) of veOlas contract
  const getUnlockedAmountComponent = () => {
    // if the user has no locked OLAS, then don't show the component
    if (!canWithdrawVeolas) return null;
    return (
      <InfoCard
        isLoading={isLoading}
        value={getFormattedNumber(lockedVeolas)}
        tooltipValue={getCommaSeparatedNumber(lockedVeolas)}
        subText="unlocked OLAS"
      />
    );
  };

  return {
    getBalanceComponent,
    getVotingPowerComponent,
    getVotingPercentComponent,
    getLockedAmountComponent,
    getUnlockTimeComponent,
    getUnlockedAmountComponent,
  };
};
