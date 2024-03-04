import { useState } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import {
  Alert, Button, Divider, Form, Modal,
} from 'antd';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';

import { parseToWei } from 'common-util/functions';
import { FormItemInputNumber, MaxButton, dateInSeconds } from '../../common';
import {
  hasSufficientTokensRequest,
  updateIncreaseAmount,
  approveOlasByOwner,
} from '../contractUtils';
import ProjectedVeolas from './ProjectedVeolas';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { FormContainer } from '../styles';

export const IncreaseAmount = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account,
    chainId,
    olasBalanceInEth,
    isMappedAmountZero,
    hasNoOlasBalance,
    mappedEndTime,
    mappedAmount,
    getData,
  } = useFetchBalances();
  const { getLockedAmountComponent } = useVeolasComponents();

  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);

  const mappedEndTimeInSeconds = dateInSeconds(mappedEndTime);
  const amountInEth = Form.useWatch('amount', form);

  const onApprove = async () => {
    try {
      setIsApproving(true);
      const amountBN = ethers.parseUnits(mappedAmount, 'ether');
      await approveOlasByOwner({
        account,
        chainId,
        amount: amountBN,
      });
    } catch (error) {
      console.error(error);
      notifyError();
    } finally {
      setIsApproving(false);
      setIsApproveModalVisible(false);
    }
  };

  /**
   * can increase amount only if the mapped amount is zero (ie. no lock exists)
   * or if the user has some olas tokens.
   */
  const cannotIncreaseAmount = isMappedAmountZero || hasNoOlasBalance || !account;

  const onFinish = async ({ amount }) => {
    try {
      setIsLoading(true);

      const hasSufficientTokens = await hasSufficientTokensRequest({
        account,
        chainId,
        amount: mappedAmount,
      });

      if (!hasSufficientTokens) {
        setIsLoading(false);
        setIsApproveModalVisible(true);
        return;
      }

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
    } catch (error) {
      window.console.error(error);
      notifyError();
    } finally {
      setIsLoading(false);
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

      {isApproveModalVisible && (
        <Modal
          title="Approve OLAS"
          open={isApproveModalVisible}
          footer={null}
          onCancel={() => setIsApproveModalVisible(false)}
        >
          <Alert
            message="Before increasing the amount, an approval for OLAS is required. Please approve to proceed."
            type="warning"
          />

          <br />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isApproving}
              onClick={onApprove}
            >
              Approve
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

IncreaseAmount.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
