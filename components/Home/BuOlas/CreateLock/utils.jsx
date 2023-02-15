import { getContractAddress, getBuolasContract, getOlasContract } from 'common-util/Contracts';
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
      window.console.log('Error occured on approving veOLAS by owner:');
      reject(e);
    });
});

/**
 * create lock for buOlas
 */
export const createBuolasLockRequest = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract(window.MODAL_PROVIDER, chainId);
  const signer = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const values = {
    signer,
    amount: parseEther(1),
    numSteps: 4,
  };

  console.log(values);

  contract.methods
    .createLockFor(values.signer, values.amount, values.numSteps)
    .send({ from: account })
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on withdrawing balance');
      reject(e);
    });
});
