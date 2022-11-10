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

export const fetchReleasableAmount = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .releasableAmount(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching ReleasableAmount:');
      reject(e);
    });
});

// TODO: check if the below functions will be used
export const fetchBalanceOf = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

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

export const fetchTotalSupplyLocked = ({ chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

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

export const fetchCanCreateLock = async ({ account, chainId }) => {
  try {
    const { amount } = await fetchMapLockedBalances({ account, chainId });
    return Promise.resolve({
      cannotCreateLock: !!(amount && Number(amount) !== 0),
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Create lock
export const createLock = ({
  amount, unlockTime, account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .createLock(amount, unlockTime)
    .send({ from: account })
    .once('transactionHash', (hash) => resolve(hash))
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on creating lock:');
      reject(e);
    });
});

// Increase Amount
export const increaseAmount = ({ amount, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .increaseAmount(amount)
    .send({ from: account })
    .once('transactionHash', (hash) => resolve(hash))
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on increasing amount:');
      reject(e);
    });
});

// Increase Unlock time
export const increaseUnlockTime = ({ time, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .increaseUnlockTime(time)
    .send({ from: account })
    .once('transactionHash', (hash) => resolve(hash))
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on increasing amount:');
      reject(e);
    });
});
