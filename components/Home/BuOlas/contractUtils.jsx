import {
  getContractAddress,
  getBuolasContract,
  getOlasContract,
} from 'common-util/Contracts';
import { MAX_AMOUNT } from 'common-util/functions';
import { parseEther } from 'components/Home/common';

export const approveOlasByOwner = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);
  const spender = getContractAddress('buOlas', chainId);

  contract.methods
    .approve(spender, MAX_AMOUNT)
    .send({ from: account })
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      window.console.log('Error occured on approving buOLAS by owner');
      reject(e);
    });
});

/**
 * create lock for buOlas
 */
export const createBuolasLockRequest = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  // creating lock for the signer with 100 ETH & locked for 4 years
  const values = {
    signer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    amount: parseEther('100'),
    numSteps: 4,
  };

  contract.methods
    .createLockFor(values.signer, values.amount, values.numSteps)
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on creating buOlas lock');
      reject(e);
    });
});

/**
 * Withdraw buOlas
 */
export const withdrawRequest = ({
  account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .withdraw()
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on withdrawing buOlas balance');
      reject(e);
    });
});
