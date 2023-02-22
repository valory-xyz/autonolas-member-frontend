import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import { fetchMappedBalances, fetchVeolasDetails } from 'store/setup/actions';
import { parseToWei, FormItemInputNumber, MaxButton } from '../../common';
import { updateIncreaseAmount } from '../utils';
import { FormContainer } from './styles';

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
        amount: sendMaxAmount ? olasBalance : parseToWei(amount),
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
      dispatch(fetchVeolasDetails());
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <FormContainer>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="increase-amount-form"
          className="custom-vertical-form"
          onFinish={onFinish}
        >
          <div className="full-width">
            <FormItemInputNumber />
            <MaxButton
              onMaxClick={() => form.setFieldsValue({ amount: olasBalance })}
            />
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={cannotIncreaseAmount}
            >
              Add to lock
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>

      <Button
        type="primary"
        htmlType="submit"
        disabled={cannotIncreaseAmount}
        onClick={() => onFinish({ sendMaxAmount: true })}
        style={{ display: 'none' }}
      >
        Lock maximum amount
      </Button>
    </>
  );
};
