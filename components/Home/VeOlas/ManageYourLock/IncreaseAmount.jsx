import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Form, Typography, Divider,
} from 'antd/lib';
import {
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
  AlreadyAllAmountLocked,
} from 'common-util/functions';
import {
  fetchMappedBalances,
  fetchVotesAndTotalSupplyLocked,
} from 'store/setup/actions';
import { parseAmount, FormItemInputNumber } from '../../common';
import { updateIncreaseAmount } from '../utils';

const { Title } = Typography;

export const IncreaseAmount = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isMappedAmountZero = useSelector(
    (state) => state?.setup?.mappedBalances?.isMappedAmountZero || false,
  );
  const olasBalance = useSelector((state) => state?.setup?.olasBalance);
  const hasNoOlasBalance = Number(olasBalance || '0') === 0;

  /**
   * can increase amount only if the mapped amount is zero (ie. no lock exists)
   * or if the user has some olas tokens.
   */
  const cannotIncreaseAmount = isMappedAmountZero || hasNoOlasBalance || !account;

  const [form] = Form.useForm();

  const onFinish = async ({ amount, sendMaxAmount }) => {
    try {
      const txHash = await updateIncreaseAmount({
        amount: sendMaxAmount ? olasBalance : parseAmount(amount),
        account,
        chainId,
      });
      notifySuccess(
        'Amount increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the amount is increased,
      // fetch the newly updated mapped balances & votes.
      dispatch(fetchMappedBalances());
      dispatch(fetchVotesAndTotalSupplyLocked());
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
            disabled={cannotIncreaseAmount}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Divider>OR</Divider>

      <Button
        type="primary"
        htmlType="submit"
        disabled={cannotIncreaseAmount}
        onClick={() => onFinish({ sendMaxAmount: true })}
      >
        Lock maximum amount
      </Button>

      <br />
      <br />
      {account && (
        <>
          {isMappedAmountZero && <CannotIncreaseAlert />}
          {(hasNoOlasBalance && !isMappedAmountZero) && <AlreadyAllAmountLocked />}
        </>
      )}
    </>
  );
};

/**
 * 1. lock maximum amount in main page
 * 2. locking time to be reflected
 */
