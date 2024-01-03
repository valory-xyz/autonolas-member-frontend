/* eslint-disable max-len */
import { ethers } from 'ethers';
import { sendTransaction } from '@autonolas/frontend-library';
import { MAX_AMOUNT, parseEther } from 'common-util/functions';
import {
  getVeolasContract,
  getOlasContract,
  getContractAddress,
} from 'common-util/Contracts';

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
export const approveOlasByOwner = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract();
  const spender = getContractAddress('veOlas', chainId);

  const fn = contract.methods
    .approve(spender, MAX_AMOUNT)
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      window.console.log('Error occured on approving OLAS by owner');
      reject(e);
    });
});

/**
 * Create lock
 */
export const createLockRequest = ({ amount, unlockTime, account }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract();

  const fn = contract.methods
    .createLock(amount, unlockTime)
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => {
      resolve(response?.transactionHash);
    })
    .catch((e) => {
      window.console.log('Error occured on creating lock for veOlas');
      reject(e);
    });
});

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
