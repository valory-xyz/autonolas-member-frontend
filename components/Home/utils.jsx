import { notification } from 'antd/lib';
import { getSaleContract } from 'common-util/Contracts';
import { COLOR } from 'util/theme';

export const getBalanceDetails = (address, providerObject) => new Promise((resolve, reject) => {
  const contract = getSaleContract(providerObject);
  contract
    .claimableBalances(address)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const claimBalances = (account, providerObject) => new Promise((resolve, reject) => {
  const contract = getSaleContract(providerObject);
  contract
    .claim()
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
