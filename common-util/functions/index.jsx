import { ethers } from 'ethers';
import { notification, Alert } from 'antd/lib';
import { isNil } from 'lodash';
import { COLOR } from 'util/theme';

export const MAX_AMOUNT = ethers.constants.MaxUint256;

export const getBalance = (account, p) => new Promise((resolve, reject) => {
  p.eth
    .getBalance(account)
    .then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      resolve(balanceInEth);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 *
 * @param {BigNumebr} value value to be converted to Eth
 * @param {Number} dv Default value to be returned
 * @returns
 */
export const formatToEth = (value, dv = 0) => {
  if (isNil(value)) return dv || 0;
  return (+ethers.utils.formatEther(value)).toFixed(8);
};

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
  style: { border: `1px solid ${COLOR.PRIMARY}` },
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
  style: { border: `1px solid ${COLOR.PRIMARY}` },
});

export const CannotIncreaseAlert = () => (
  <Alert
    message="You don't have any amount locked, please lock before increasing amount or unlockTime."
    type="warning"
  />
);

export const AlreadyAllAmountLocked = () => (
  <Alert message="You don't have any OLAS to lock." type="warning" />
);

export const getTotalVotesPercentage = (votes, totalSupply) => {
  if (votes && totalSupply) {
    const votesInBg = ethers.BigNumber.from(votes);
    const totalSupplyInBg = ethers.BigNumber.from(totalSupply);
    const votingPowerInPercentage = votesInBg
      .div(totalSupplyInBg)
      .mul(100)
      .toNumber()
      .toFixed(2);

    return votingPowerInPercentage;
  }

  return null;
};
