import { ethers } from 'ethers';
import { formatToEth } from 'common-util/functions';

export const getNextReleasableAmount = (lockedBalance, timestamp) => {
  const STEP_TIME = 365 * 86400;
  let buolasNextReleasableTime = null;
  let buolasNextReleasableAmount = null;

  const startTime = Number(lockedBalance.startTime);
  const endTime = Number(lockedBalance.endTime);
  const totalAmount = ethers.BigNumber.from(lockedBalance.totalAmount);
  const transferredAmount = ethers.BigNumber.from(lockedBalance.transferredAmount);

  if (endTime === 0) {
    // Revoke has been applied
    buolasNextReleasableTime = new Date();
    buolasNextReleasableAmount = transferredAmount;
  } else {
    // Else follow the calculation of what is currently left
    const totalNumSteps = ((endTime - startTime) / STEP_TIME);
    const releasedSteps = ((timestamp - startTime) / STEP_TIME);
    const numNextStep = releasedSteps + 1;
    buolasNextReleasableTime = startTime + STEP_TIME * numNextStep;

    console.log(
      {
        lockedBalance,
        totalNumSteps,
        releasedSteps,
        numNextStep,
        buolasNextReleasableTime,

      },
      10,
    );
    if (numNextStep >= totalNumSteps) {
      buolasNextReleasableAmount = totalAmount.sub(transferredAmount);
    } else {
      const denominator = totalNumSteps - transferredAmount;
      buolasNextReleasableAmount = (totalAmount * numNextStep) / denominator;
    }
  }

  return {
    buolasNextReleasableTime,
    buolasNextReleasableAmount: formatToEth(buolasNextReleasableAmount),
  };
};
