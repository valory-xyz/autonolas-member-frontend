/* eslint-disable max-len */
import { ethers } from 'ethers';
import {
  getVeolasContract,
  getOlasContract,
  getContractAddress,
} from 'common-util/Contracts';
import { MAX_AMOUNT, parseEther, sendTransaction } from 'common-util/functions';

/**
 * Increase Amount
 */
export const updateIncreaseAmount = ({ amount, account }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract();

  const fn = contract.methods.increaseAmount(amount).send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on increasing amount');
      reject(e);
    });
});

/**
 * Increase Unlock time
 */
export const updateIncreaseUnlockTime = ({ time, account }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract();

  const fn = contract.methods
    .increaseUnlockTime(time)
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on increasing unlock time');
      reject(e);
    });
});

/**
 * Check if `Approve` button can be clicked; `allowance` returns 0 or
 * MAX_AMOUNT if already approved. Can read more
 * [here](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20-allowance-address-address-).
 */
export const hasSufficientTokensRequest = ({ account, chainId, amount }) => new Promise((resolve, reject) => {
  const contract = getOlasContract();
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .allowance(account, spender)
    .call()
    .then((response) => {
      const responseInBg = ethers.toBigInt(response);
      const amountInBg = ethers.parseUnits(`${amount}`);

      // check if the allowance is greater than the amount input
      resolve(responseInBg > amountInBg);
    })
    .catch((e) => {
      window.console.log('Error occured on calling `allowance` method');
      reject(e);
    });
});

/**
 * Approve amount of OLAS to be used
 */
export const approveOlasByOwner = async ({ account, chainId }) => {
  const contract = getOlasContract();
  const spender = getContractAddress('veOlas', chainId);

  console.log({
    account,
    spender,
    MAX_AMOUNT,
    contract,
    chainId,
  });

  const fn = contract.methods
    .approve(spender, MAX_AMOUNT)
    .send({ from: account });

  const response = await sendTransaction(fn, account);
  return response;
};

/**
 * Create lock
 */
export const createLockRequest = async ({ amount, unlockTime, account }) => {
  try {
    const contract = getVeolasContract();

    console.log({
      amount,
      unlockTime,
      account,
      contract,
    });

    const fn = contract.methods
      .createLock(amount, unlockTime)
      .send({ from: account, value: amount });

    const response = await sendTransaction(fn, account);
    return response?.transactionHash;
  } catch (error) {
    window.console.log('Error occured on creating lock');
    throw error;
  }
};

/**
 * Withdraw VeOlas
 */
export const withdrawVeolasRequest = ({ account }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract();

  const fn = contract.methods.withdraw().send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on withdrawing veOlas');
      reject(e);
    });
});

/**
 * transfer OLAS to account
 * NOTE: this is a internal method for testing and
 * won't be exposed or visible to the user
 */
export const transferOlasToAccountRequest = ({ account, signer }) => new Promise((resolve, reject) => {
  const contract = getOlasContract();

  // transfering OLAS to the signer account with 100 ETH.
  const values = {
    signer,
    amount: parseEther('10000'),
  };

  const fn = contract.methods
    .transfer(values.signer, values.amount)
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on transfering OLAS to account');
      reject(e);
    });
});
