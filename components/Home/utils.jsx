import { notification } from 'antd/lib';
import {
  getOlaContract,
  getBuOlaContract,
  getVeOlaContract,
  getSaleContract,
} from 'common-util/Contracts';
import { COLOR } from 'util/theme';

export const getBuOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getBuOlaContract();

  contract.methods
    .owner()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVeOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getVeOlaContract();

  contract.methods
    .name()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getOlaContract();

  contract.methods
    .inflationRemainder()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getBalanceDetails = (address) => new Promise((resolve, reject) => {
  const contract = getSaleContract();

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

export const claimBalances = (account) => new Promise((resolve, reject) => {
  const contract = getSaleContract();

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
