import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Form } from 'antd/lib';
import { notifyError, notifySuccess, parseToWei } from 'common-util/functions';
import { FormItemInputNumber, MaxButton, dateInSeconds } from '../../common';
import { updateIncreaseAmount } from '../contractUtils';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { FormContainer } from '../styles';
import ProjectedVeolas from './ProjectedVeolas';

export const IncreaseAmount = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account,
    olasBalanceInEth,
    isMappedAmountZero,
    hasNoOlasBalance,
    mappedEndTime,
    getData,
  } = useFetchBalances();
  const { getLockedAmountComponent } = useVeolasComponents();
  const [isLoading, setIsLoading] = useState(false);

  const mappedEndTimeInSeconds = dateInSeconds(mappedEndTime);
  const amountInEth = Form.useWatch('amount', form);

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
        onFinish={onFinish}
      >
        {getLockedAmountComponent({ hideTitle: true })}

        <Divider />

        <div className="mb-12">
          <FormItemInputNumber text="Lock more OLAS" />
          <MaxButton
            onMaxClick={() => {
              form.setFieldsValue({ amount: olasBalanceInEth });
              form.validateFields(['amount']);
            }}
          />
        </div>

        <ProjectedVeolas
          olasLockInEthUnits={amountInEth}
          unlockTimeInSeconds={mappedEndTimeInSeconds}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={cannotIncreaseAmount}
            loading={isLoading}
          >
            Increase lock
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

IncreaseAmount.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
