import { ethers } from 'ethers';
import { formatToEth } from 'common-util/functions';

export const getNextReleasableAmount = (lockedBalance, timestamp) => {
  const STEP_TIME = 365 * 86400;
  let buolasNextReleasableTime = null;
  let buolasNextReleasableAmount = null;

  const startTime = Number(lockedBalance.startTime);
  const endTime = Number(lockedBalance.endTime);

  if (endTime === 0) {
    // Revoke has been applied
    buolasNextReleasableTime = new Date();
    buolasNextReleasableAmount = 0;
  } else {
    // Else follow the calculation of what is currently left
    const totalNumSteps = ((endTime - startTime) / STEP_TIME);
    const releasedSteps = ((timestamp - startTime) / STEP_TIME);
    const numNextStep = releasedSteps + 1;
    buolasNextReleasableTime = (startTime + STEP_TIME * numNextStep);

    if (numNextStep >= totalNumSteps) {
      buolasNextReleasableAmount = lockedBalance.totalAmount - lockedBalance.transferredAmount;
    } else {
      buolasNextReleasableAmount = (lockedBalance.totalAmount * numNextStep) / totalNumSteps;
      buolasNextReleasableAmount -= lockedBalance.transferredAmount;
    }
  }

  return {
    // multiplied by 1000 to convert to milliseconds
    buolasNextReleasableTime: buolasNextReleasableTime * 1000,
    // format to eth for display
    buolasNextReleasableAmount: formatToEth(ethers.BigNumber.from(`${buolasNextReleasableAmount}`)),
  };
};
