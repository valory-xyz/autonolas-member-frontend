/* eslint-disable max-len */
import { ethers } from 'ethers';
import { MAX_AMOUNT, parseEther } from 'common-util/functions';
import {
  getVeolasContract,
  getOlasContract,
  getContractAddress,
} from 'common-util/Contracts';

/**
 * TERMINOLOGY:
 * spender = LOCAL_ADDRESSES.VEOLAS_ADDRESS_LOCAL
 */

/**
 * Increase Amount
 */
export const updateIncreaseAmount = ({ amount, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .increaseAmount(amount)
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on increasing amount');
      reject(e);
    });
});

/**
 * Increase Unlock time
 */
export const updateIncreaseUnlockTime = ({ time, account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .increaseUnlockTime(time)
    .send({ from: account })
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
export const cannotApproveTokens = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .allowance(account, spender)
    .call()
    .then((response) => {
      // check if the allowance is equal to MAX_AMOUNT
      resolve(ethers.BigNumber.from(response).eq(MAX_AMOUNT));
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
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('veOlas', chainId);

  contract.methods
    .approve(spender, MAX_AMOUNT)
    .send({ from: account })
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
export const createLockRequest = ({
  amount, unlockTime, account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .createLock(amount, unlockTime)
    .send({ from: account })
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
export const withdrawVeolasRequest = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .withdraw()
    .send({ from: account })
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
export const transferOlasToAccountRequest = ({ account, chainId, signer }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  // transfering OLAS to the signer account with 100 ETH.
  const values = {
    signer,
    amount: parseEther('10000'),
  };

  contract.methods
    .transfer(values.signer, values.amount)
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on transfering OLAS to account');
      reject(e);
    });
});
