import { getSaleContract } from 'common-util/Contracts';

export const getBalanceDetails = (address) => new Promise((resolve, reject) => {
  const contract = getSaleContract();
  console.log({ account: address });

  contract.methods
    .claimableBalances(address)
    .call()
    .then((response) => {
      console.log({ response });
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
