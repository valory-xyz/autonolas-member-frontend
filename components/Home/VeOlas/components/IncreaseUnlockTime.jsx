import { useState } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import {
  Alert, Button, Divider, Form, Modal,
} from 'antd/lib';

import { notifyError, notifySuccess } from '@autonolas/frontend-library';
import { parseToSeconds, FormItemDate, dateInSeconds } from '../../common';
import {
  approveOlasByOwner,
  hasSufficientTokensRequest,
  updateIncreaseUnlockTime,
} from '../contractUtils';
import ProjectedVeolas from './ProjectedVeolas';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { FormContainer } from '../styles';

export const IncreaseUnlockTime = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account,
    chainId,
    mappedEndTime,
    mappedAmount,
    isMappedAmountZero,
    getData,
  } = useFetchBalances();
  const { getUnlockTimeComponent } = useVeolasComponents();

  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);

  const unlockTimeInSeconds = dateInSeconds(Form.useWatch('unlockTime', form));

  const onApprove = async () => {
    try {
      setIsApproving(true);
      const amountBN = ethers.utils.parseUnits(mappedAmount, 'ether');
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

  const onFinish = async (e) => {
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

      const txHash = await updateIncreaseUnlockTime({
        time: parseToSeconds(e.unlockTime),
        account,
      });
      notifySuccess(
        'Unlock time increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the unlockTime is increased,
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
      <FormContainer style={{ marginTop: '1rem' }}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="increase-unlock-time-form"
          onFinish={onFinish}
        >
          {getUnlockTimeComponent({ hideTitle: true })}
          <Divider />
          <div className="full-width">
            <FormItemDate startDate={mappedEndTime} />
          </div>

          <ProjectedVeolas
            olasLockInEthUnits={mappedAmount}
            unlockTimeInSeconds={unlockTimeInSeconds}
          />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!account || isMappedAmountZero}
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
            message="Before increasing the lock time, an approval for OLAS is required. Please approve to proceed."
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

IncreaseUnlockTime.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
