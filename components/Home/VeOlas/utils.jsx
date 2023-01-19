/* eslint-disable max-len */
import { ethers } from 'ethers';
import { formatToEth } from 'common-util/functions';
import {
  getVeolasContract,
  getOlasContract,
  getContractAddress,
} from 'common-util/Contracts';

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
      // console.log('Votes:', response);
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

// Increase Amount
export const updateIncreaseAmount = ({ amount, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  // console.log({
  //   amount,
  //   account,
  //   chainId,
  // });
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
 * Check if `Approve` button can be clicked.
 * `allowance` returns 0 or maxAmount if already approved
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

/**
 * Approve amount of Olas to be used
 */
export const approveOlasByOwner = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .approve(spender, maxAmount)
    .send({ from: account })
    .then(async (response) => {
      resolve(response);
    })
    .catch((e) => {
      window.console.log('Error occured on approving Olas by owner:');
      reject(e);
    });
});

/**
 * Create lock
 */
export const createLockRequest = ({
  amount, unlockTime, account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);
  contract.methods
    .createLock(amount, unlockTime)
    .send({ from: account })
    .then(async (response) => {
      resolve(response?.transactionHash);
    })
    .catch((e) => {
      window.console.log('Error occured on creating lock:');
      reject(e);
    });
});

/**
 * *********************************************
 * functions not used in the UI
 * *********************************************
 */
