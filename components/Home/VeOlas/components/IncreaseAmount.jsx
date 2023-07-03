import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd/lib';
import { notifyError, notifySuccess, parseToWei } from 'common-util/functions';
import { FormItemInputNumber, MaxButton } from '../../common';
import { updateIncreaseAmount } from '../contractUtils';
import { useFetchBalances } from '../hooks';
import { FormContainer } from '../styles';

export const IncreaseAmount = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account,
    olasBalanceInEth,
    isMappedAmountZero,
    hasNoOlasBalance,
    getData,
  } = useFetchBalances();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * can increase amount only if the mapped amount is zero (ie. no lock exists)
   * or if the user has some olas tokens.
   */
  const cannotIncreaseAmount = isMappedAmountZero || hasNoOlasBalance || !account;

  const onFinish = async ({ amount }) => {
    try {
      setIsLoading(true);
      const txHash = await updateIncreaseAmount({
        amount: parseToWei(amount),
        account,
      });
      notifySuccess(
        'Amount increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the amount is increased,
      // fetch the newly updated mapped balances & votes.
      getData();

      // close the modal after successful locking & loading state
      closeModal();
      setIsLoading(false);
    } catch (error) {
      window.console.error(error);
      notifyError();
      setIsLoading(false);
    }
  };

  return (
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
          <FormItemInputNumber text="Lock more OLAS" />
          <MaxButton
            onMaxClick={() => {
              form.setFieldsValue({ amount: olasBalanceInEth });
              form.validateFields(['amount']);
            }}
          />
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={cannotIncreaseAmount}
            loading={isLoading}
          >
            Add to lock
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

IncreaseAmount.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
