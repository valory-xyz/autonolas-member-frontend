import PropTypes from 'prop-types';
import moment from 'moment';
import { ethers } from 'ethers';
import {
  Button, Form, InputNumber, DatePicker, Typography,
} from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import { createLock } from '../utils';

const { Title } = Typography;
const fullWidth = { width: '100%' };

export const CreateLock = ({ account, chainId }) => {
  const [form] = Form.useForm();

  // Can not select days before today and today
  const disabledDate = (current) => {
    const pastDate = current < moment().endOf('day');

    // cannot select date more than 4 years
    const futureDate = current > moment().add(4, 'years');
    return (current && pastDate) || futureDate;
  };

  const onFinish = async (e) => {
    try {
      await createLock({
        // multiply by 10^18
        amount: ethers.utils.parseUnits(`${e.amount}`, 18).toString(),

        // - convert to milliseconds
        // - divide by 100 to convert to seconds
        // - remove decimals
        unlockTime: Math.round(new Date(e.unlockTime).getTime() / 1000).toString(),
        account,
        chainId,
      });
      notifySuccess('Lock created successfully');
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="create-lock-form"
        onFinish={onFinish}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Amount is required' },
            () => ({
              validator(_, value) {
                return value <= 1
                  ? Promise.reject(new Error('Please input a valid amount'))
                  : Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber style={fullWidth} />
        </Form.Item>

        <Form.Item
          name="unlockTime"
          label="Unlock Time"
          rules={[{ required: true, message: 'Unlock Time is required' }]}
        >
          <DatePicker
            disabledDate={disabledDate}
            showTime={{ format: 'HH:mm' }}
            format="MM/DD/YYYY HH:mm"
            style={fullWidth}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

CreateLock.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

CreateLock.defaultProps = {
  account: null,
  chainId: null,
};
