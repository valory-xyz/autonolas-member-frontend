/* eslint-disable max-len */
import { ethers } from 'ethers';
import { sendTransaction } from '@autonolas/frontend-library';
import { MAX_AMOUNT, parseEther } from 'common-util/functions';
import {
  getVeolasContract,
  getOlasContract,
  getContractAddress,
} from 'common-util/Contracts';

const ESTIMATED_GAS_LIMIT = 500_000;

const getEstimatedGasLimit = async (fn, account) => {
  if (!account) {
    throw new Error('Invalid account passed to estimate gas limit');
  }

  try {
    const estimatedGas = await fn.estimateGas({ from: account });
    return Math.floor(estimatedGas);
  } catch (error) {
    window.console.warn(
      `Error occured on estimating gas, defaulting to ${ESTIMATED_GAS_LIMIT}`,
    );
  }

  return ESTIMATED_GAS_LIMIT;
};

export const updateIncreaseAmount = async ({ amount, account }) => {
  const contract = getVeolasContract();

  try {
    const increaseAmountFn = contract.methods.increaseAmount(amount);
    const estimatedGas = await getEstimatedGasLimit(increaseAmountFn, account);
    const fn = increaseAmountFn.send({ from: account, gasLimit: estimatedGas });

    const response = await sendTransaction(fn, account);
    return response?.transactionHash;
  } catch (e) {
    window.console.log(
      'Error occurred on increasing amount with estimated gas',
    );
    throw e;
  }
};

/**
 * Increase Unlock time
 */
export const updateIncreaseUnlockTime = async ({ time, account }) => {
  const contract = getVeolasContract();

  try {
    const increaseUnlockTimeFn = contract.methods.increaseUnlockTime(time);
    const estimatedGas = await getEstimatedGasLimit(
      increaseUnlockTimeFn,
      account,
    );

    const fn = increaseUnlockTimeFn.send({
      from: account,
      gasLimit: estimatedGas,
    });
    const response = await sendTransaction(fn, account);
    return response?.transactionHash;
  } catch (error) {
    window.console.log('Error occured on increasing unlock time');
    throw error;
  }
};

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
      const responseInBg = ethers.BigNumber.from(response);
      // Resolve false if the response amount is zero
      if (responseInBg.isZero()) {
        resolve(false);
        return;
      }

      const amountInBg = ethers.utils.parseUnits(`${amount}`);

      // check if the allowance is greater than or equal to the amount input
      resolve(responseInBg.gte(amountInBg));
    })
    .catch((e) => {
      window.console.log('Error occured on calling `allowance` method');
      reject(e);
    });
});

/**
 * Approve amount of OLAS to be used
 */
export const approveOlasByOwner = ({ account, chainId, amount = MAX_AMOUNT }) => new Promise((resolve, reject) => {
  const contract = getOlasContract();
  const spender = getContractAddress('veOlas', chainId);

  const fn = contract.methods
    .approve(spender, amount)
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
export const createLockRequest = async ({ amount, unlockTime, account }) => {
  const contract = getVeolasContract();

  try {
    const createLockFn = contract.methods.createLock(amount, unlockTime);
    const estimatedGas = await getEstimatedGasLimit(createLockFn, account);
    const fn = createLockFn.send({ from: account, gasLimit: estimatedGas });

    const response = await sendTransaction(fn, account);
    return response?.transactionHash;
  } catch (error) {
    window.console.log('Error occured on creating lock for veOlas');
    throw error;
  }
};

/**
 * Withdraw VeOlas
 */
export const withdrawVeolasRequest = async ({ account }) => {
  const contract = getVeolasContract();

  try {
    const withdrawFn = contract.methods.withdraw();
    const estimatedGas = await getEstimatedGasLimit(withdrawFn, account);
    const fn = withdrawFn.send({ from: account, gasLimit: estimatedGas });

    const response = sendTransaction(fn, account);
    return response?.transactionHash;
  } catch (error) {
    window.console.log('Error occured on withdrawing veOlas');
    throw error;
  }
};

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
