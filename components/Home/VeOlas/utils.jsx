import { getVeolasContract } from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';

export const fetchBalanceOf = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching balance:');
      reject(e);
    });
});

export const fetchVotes = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .getVotes(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching balance:');
      reject(e);
    });
});

export const fetchTotalSupplyLocked = ({ chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .totalSupplyLocked()
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching balance:');
      reject(e);
    });
});

export const fetchMapLockedBalances = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .mapLockedBalances(account)
    .call()
    .then((response) => {
      // multiplied by 1000 to convert to milliseconds
      resolve({
        amount: formatToEth(response.amount),
        endTime: response.endTime * 1000,
      });
    })
    .catch((e) => {
      window.console.log('Error occured on fetching MapLockedBalances:');
      reject(e);
    });
});

// CREATE LOCK
export const createLock = ({
  amount, unlockTime, account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .createLock(amount, unlockTime)
    .send({ from: account })
    .then((response) => {
      console.log(response);
      resolve(response);
    })
    .catch((e) => {
      window.console.log('Error occured on creating lock:');
      reject(e);
    });
});
