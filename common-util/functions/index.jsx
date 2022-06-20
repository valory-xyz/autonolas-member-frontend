import Web3 from 'web3';
import { CONSTANTS } from 'util/constants';

export const getBalance = (account) => new Promise((resolve, reject) => {
  window.ethereum
    .request({
      method: CONSTANTS.ETH_GETBALANCE,
      params: [account, 'latest'],
    })
    .then((b) => {
      const balanceInEther = Web3.utils.fromWei(b, 'ether');
      resolve(balanceInEther);
    })
    .catch((e) => {
      reject(e.message);
    });
});

export const AB = null;
