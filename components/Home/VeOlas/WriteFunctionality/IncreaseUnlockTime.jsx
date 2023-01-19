import { useSelector } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import { notifyError, notifySuccess, CannotIncreaseAlert } from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { updateIncreaseUnlockTime } from '../utils';

const { Title } = Typography;

export const IncreaseUnlockTime = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const cannotIncreaseAmount = useSelector(
    (state) => !state?.setup?.mappedBalances?.isMappedAmoutZero,
  );

  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await updateIncreaseUnlockTime({
        time: parseToSeconds(e.unlockTime),
        account,
        chainId,
      });
      notifySuccess(
        'Unlock time increased successfully!',
        `Transaction Hash: ${txHash}`,
      );
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Increase Unlock Time</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-amount-form"
        onFinish={onFinish}
      >
        <FormItemDate />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!account || cannotIncreaseAmount}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      {cannotIncreaseAmount && <CannotIncreaseAlert />}

    </>
  );
};
