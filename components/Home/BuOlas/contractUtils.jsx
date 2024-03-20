import { getBuolasContract } from 'common-util/Contracts';
import { sendTransaction } from 'common-util/functions';

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
