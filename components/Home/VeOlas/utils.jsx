/* eslint-disable max-len */
import {
  getVeolasContract,
  getOlasContract,
  LOCAL_ADDRESSES,
  getContractAddress,
} from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';
import { ethers } from 'ethers';
// import { fetchBalanceOfOlas } from './TestSection/utils';

/**
 * spender = LOCAL_ADDRESSES.VEOLAS_ADDRESS_LOCAL
 */
const maxAmount = ethers.constants.MaxUint256;

export const fetchVotes = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .getVotes(account)
    .call()
    .then((response) => {
      console.log('Votes:', response);
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

  console.log({
    amount,
    unlockTime,
    account,
    chainId,
  });
  contract.methods
    .createLock('10000000000', 7 * 86400)
    .send({ from: account })
  // .once('transactionHash', (hash) => resolve(hash))
    .then(async (response) => {
      resolve(response?.transactionHash);
    })
    .catch((e) => {
      window.console.log('Error occured on creating lock:');
      reject(e);
    });
});

// Increase Amount
export const updateIncreaseAmount = ({ amount, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  console.log({
    amount,
    account,
    chainId,
  });
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
/**
 * Approve tokens before creating lock
 */
export const cannotApproveTokens = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .allowance(account, spender)
    .call()
    .then(async (response) => {
      // check if the allowance is equal to maxAmount
      resolve(ethers.BigNumber.from(response).eq(maxAmount));
    })
    .catch((e) => {
      window.console.log('Error occured on calling `allowance` method');
      reject(e);
    });
});

export const approveOlasByOwner = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .approve(spender, maxAmount)
    .send({ from: account })
    .then(async (response) => {
      console.log(response);

      const amount = await contract.methods
        .allowance(account, LOCAL_ADDRESSES.VEOLAS_ADDRESS_LOCAL)
        .call();
      console.log({ amount, maxAmount });
      resolve();
    })
    .catch((e) => {
      window.console.log('Error occured on approving Olas by owner:');
      reject(e);
    });
});
