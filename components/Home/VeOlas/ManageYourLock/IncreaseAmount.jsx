import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import {
  parseToEth,
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
  AlreadyAllAmountLocked,
} from 'common-util/functions';
import { fetchMappedBalances, fetchVeolasDetails } from 'store/setup/actions';
import { parseAmount, FormItemInputNumber } from '../../common';
import { updateIncreaseAmount } from '../utils';
import { FormContainer } from './styles';

const { Text } = Typography;

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
          <div>
            <FormItemInputNumber maxAmount={parseToEth(olasBalance)} />

            <Form.Item className="mb-0">
              <Text type="secondary">
                OLAS balance: 200&nbsp;
                <Button
                  htmlType="button"
                  type="link"
                  // onClick={prefillOwnerAddress}
                  className="pl-0"
                >
                  Max
                </Button>
              </Text>
            </Form.Item>
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

      <br />
      <br />
      {account && (
        <>
          {isMappedAmountZero && <CannotIncreaseAlert />}
          {hasNoOlasBalance && !isMappedAmountZero && (
            <AlreadyAllAmountLocked />
          )}
        </>
      )}
    </>
  );
};
