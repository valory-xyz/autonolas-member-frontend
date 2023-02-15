import { getBuolasContract } from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';

export const fetchMapLockedBalances = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .mapLockedBalances(account)
    .call()
    .then((response) => {
      // multiplied by 1000 to convert to milliseconds
      resolve({
        amount: formatToEth(response.totalAmount),
        startTime: response.startTime * 1000,
        endTime: response.endTime * 1000,
        transferredAmount: response.transferredAmount,
      });
    })
    .catch((e) => {
      window.console.log('Error occured on fetching MapLockedBalances:');
      reject(e);
    });
});

/**
 * Withdraw
 */
export const withdrawRequest = ({
  account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .withdraw()
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on withdrawing balance');
      reject(e);
    });
});
