import { notification } from 'antd/lib';
import { getSaleContract } from 'common-util/Contracts';
import { COLOR } from 'util/theme';

export const getBalanceDetails = (address, providerObject, cd) => new Promise((resolve, reject) => {
  const contract = getSaleContract(providerObject, cd);
  contract.methods
    .claimableBalances(address)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const claimBalances = (account, providerObject, cd) => new Promise((resolve, reject) => {
  const contract = getSaleContract(providerObject, cd);
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
