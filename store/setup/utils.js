import { ethers } from 'ethers';
import { formatToEth } from 'common-util/functions';

const DEC_18 = (10 ** 18);

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
    buolasNextReleasableAmount = 0;
  } else {
    // Else follow the calculation of what is currently left
    const totalNumSteps = ((endTime - startTime) / STEP_TIME);
    const releasedSteps = ((timestamp - startTime) / STEP_TIME);
    const numNextStep = releasedSteps + 1;
    buolasNextReleasableTime = (startTime + STEP_TIME * numNextStep);

    console.log(
      {
        lockedBalance,
        startTime,
        endTime,
        totalAmount,
        transferredAmount,
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
      // convert totalNumSteps to number without decimal
      // const temp1 = totalNumSteps * DEC_18;
      // const temp2 = numNextStep * DEC_18;

      // const denominator = totalNumSteps - transferredAmount;
      // buolasNextReleasableAmount = (totalAmount.mul(temp1).div(DEC_18));
      // numNextStep
      // .div(totalNumSteps);
      // buolasNextReleasableAmount.sub(transferredAmount);

      buolasNextReleasableAmount = (lockedBalance.totalAmount * numNextStep) / totalNumSteps;
      buolasNextReleasableAmount -= lockedBalance.transferredAmount;

      console.log(buolasNextReleasableAmount);

      // TODO: remove
      // buolasNextReleasableAmount = 1000000;
    }
  }

  return {
    // multiplied by 1000 to convert to milliseconds
    buolasNextReleasableTime: buolasNextReleasableTime * 1000,
    // format to eth for display
    buolasNextReleasableAmount: formatToEth(ethers.BigNumber.from(`${buolasNextReleasableAmount}`)),
  };
};
