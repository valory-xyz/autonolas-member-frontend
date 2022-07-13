import { ethers } from 'ethers';

export const getBalance = (account, provider) => new Promise((resolve, reject) => {
  provider.eth
    .getBalance(account)
    .then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      resolve(balanceInEth);
    })
    .catch((e) => {
      reject(e);
    });
});
