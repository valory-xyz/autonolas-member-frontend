import { getSaleContract } from 'common-util/Contracts';

export const claimableBalancesRequest = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getSaleContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .claimableBalances(account)
    .call()
    .then((response) => resolve(response))
    .catch((e) => {
      window.console.log('Error occured on fetching claimableBalances');
      reject(e);
    });
});
