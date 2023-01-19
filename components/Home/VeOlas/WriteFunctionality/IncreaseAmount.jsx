import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import {
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
} from 'common-util/functions';
import { fetchMappedBalances } from 'store/setup/actions';
import { parseAmount, FormItemInputNumber } from '../../common';
import { updateIncreaseAmount } from '../utils';

const { Title } = Typography;

export const IncreaseAmount = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const cannotIncreaseAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.isMappedAmountZero || false,
  );

  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await updateIncreaseAmount({
        amount: parseAmount(e.amount),
        account,
        chainId,
      });
      notifySuccess(
        'Amount increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the amount is increased,
      // fetch the newly updated mapped balances.
      dispatch(fetchMappedBalances());
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Increase Amount</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-amount-form"
        onFinish={onFinish}
      >
        <FormItemInputNumber />
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
