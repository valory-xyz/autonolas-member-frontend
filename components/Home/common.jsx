/* eslint-disable react/prop-types */
import { ethers } from 'ethers';
import moment from 'moment';
import { Form, Input, DatePicker } from 'antd/lib';
import isNil from 'lodash/isNil';
import { Shimmer } from 'common-util/Shimmer';

const fullWidth = { width: '100%' };

export const getToken = ({ tokenName, token, isLoading = false }) => (
  <div className={`section ${tokenName}-section`}>
    <div className="info">
      <span className="token-name">{tokenName}</span>
      <span className="balance">
        <>{isLoading ? <Shimmer /> : <>{token || '--'}</>}</>
      </span>
    </div>
  </div>
);

/**
 * multiplies the amount by 10^18
 */
export const parseAmount = (amount) => ethers.utils.parseUnits(`${amount}`, 18).toString();

/**
 * parse eth
 */
export const parseEther = (n) => ethers.utils.parseEther(`${n}`);

/**
 * Parses to seconds by doing the following operation in order
 * 1. convert to milliseconds
 * 2. divide by 100 to convert to seconds
 * 3. remove decimals
 */
export const parseToSeconds = (unlockTime) => {
  const futureDateInTimeStamp = Math.round(
    new Date(unlockTime).getTime() / 1000,
  );
  const todayDateInTimeStamp = Math.round(new Date().getTime() / 1000);
  return futureDateInTimeStamp - todayDateInTimeStamp;
};

/**
 * @returns Amount Input
 */
export const FormItemInputNumber = ({
  isRequired = true,
  maxAmount,
  // extra,
}) => (
  <Form.Item
    name="amount"
    label="Lock more OLAS"
    rules={[
      { required: isRequired, message: 'Amount is required' },
      () => ({
        validator(_, value) {
          if (value === '' || isNil(value)) return Promise.resolve();
          if (value <= 1) {
            return Promise.reject(new Error('Please input a valid amount'));
          }
          if (maxAmount && value > maxAmount) {
            return Promise.reject(
              new Error('Amount cannot be greater than the balance'),
            );
          }
          return Promise.resolve();
        },
      }),
    ]}
  >
    <Input
      style={fullWidth}
      placeholder="Add amount"
      disabled={!isRequired}
    />
    {/* {extra && <>{extra}</>} */}
  </Form.Item>
);

/**
 * @returns Date Input
 * @param {Date} startDate - start date from when the user can select the date
 * and startDate cannot be less than today.
 *
 * eg. If increased amount to 5th March 2023 and the current date is 20th Janurary 2023
 * then the user can select ONLY from the date from 5th March 2023
 */
export const FormItemDate = ({ startDate }) => {
  /**
   * (can select days after 7 days from today OR
   * can select from [startDate + 7 days]) AND
   * less than 4 years from today
   */
  const disableDateForUnlockTime = (current) => {
    const pastDate = startDate
      ? current < moment(new Date(startDate)).add(6, 'days').endOf('day')
      : current < moment().add(7, 'days').endOf('day');

    // do not allow selection for more than 4 years
    const futureDate = current > moment().add(4, 'years');
    return (current && pastDate) || futureDate;
  };

  return (
    <Form.Item
      name="unlockTime"
      label="Unlock Time"
      rules={[{ required: true, message: 'Unlock Time is required' }]}
      tooltip="The date should be minimum 1 week and maximum 4 years"
    >
      <DatePicker
        disabledDate={disableDateForUnlockTime}
        format="MM/DD/YYYY"
        style={fullWidth}
      />
    </Form.Item>
  );
};
