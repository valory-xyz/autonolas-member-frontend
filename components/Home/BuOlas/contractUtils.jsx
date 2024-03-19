import { getBuolasContract } from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions';

const SIGNER_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

/**
 * Withdraw buOlas
 */
export const withdrawRequest = ({ account }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract();

  const fn = contract.methods.withdraw().send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on withdrawing buOlas balance');
      reject(e);
    });
});

/**
 * Revoke buOlas from owner accout
 */
export const revokeRequest = ({ account }) => new Promise((resolve, reject) => {
  const contract = getBuolasContract();

  const fn = contract.methods
    .revoke([SIGNER_ADDRESS])
    .send({ from: account });

  sendTransaction(fn, account)
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on revoking buOlas');
      reject(e);
    });
});
