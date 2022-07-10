import { notification } from 'antd/lib';
import { getSaleContract } from 'common-util/Contracts';
import { COLOR } from 'util/theme';

export const getBalanceDetails = (address, providerObject) => new Promise((resolve, reject) => {
  console.log('>>>>    getBalanceDetails 1');
  const contract = getSaleContract(providerObject);
  console.log('>>>>    getBalanceDetails 2');

  contract
    .claimableBalances(address)
    .then((response) => {
      console.log({ response });
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const claimBalances = (account, providerObject) => new Promise((resolve, reject) => {
  const contract = getSaleContract(providerObject);

  contract.methods
    .claim()
    .send({ from: account })
    .then((response) => {
      resolve(response);

      notification.success({
        description: 'Transaction Successful',
        style: { border: `1px solid ${COLOR.PRIMARY}` },
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
      notification.error({
        description: 'Some error occured',
        style: { border: `1px solid ${COLOR.RED}` },
      });
    });
});
