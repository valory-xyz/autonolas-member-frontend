/* eslint-disable max-len */
import { getVeolasContract, getOlasContract } from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';

// TODO: remove `fetchBalanceOf` if unused - ask Mariapia
export const fetchBalanceOf = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

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
      // console.log(response);
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

export const fetchCanCreateLock = async ({ account, chainId }) => {
  try {
    const { amount } = await fetchMapLockedBalances({ account, chainId });
    // console.log(amount);
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
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

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
export const updateIncreaseAmount = ({ amount, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

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
export const updateIncreaseUnlockTime = ({ time, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

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

/**
 * *********************************************
 * functions not used in the UI
 * *********************************************
 */
export const fetchTotalSupplyOfOlas = ({ chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .totalSupply()
    .call()
    .then((response) => {
      window.console.log(response);
    })
    .catch((e) => {
      window.console.log('Error occured on fetching balance:');
      reject(e);
    });
});

export const mintOlas = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .mint(
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '10000000000',
      // ethers.BigNumber.from(100000000),
    )
    .send({ from: account })
    .then((response) => {
      window.console.log(response);
    })
    .catch((e) => {
      window.console.log('Error occured on minting Olas:');
      reject(e);
    });
});
