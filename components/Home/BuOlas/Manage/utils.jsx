import { getBuolasContract } from 'common-util/Contracts';

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
      window.console.log('Error occured on withdrawing balance');
      reject(e);
    });
});
