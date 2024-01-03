import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, Form, Modal,
} from 'antd';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';

import { parseToWei } from 'common-util/functions';
import {
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
  MaxButton,
  dateInSeconds,
} from '../../common';
import {
  hasSufficientTokensRequest,
  approveOlasByOwner,
  createLockRequest,
} from '../contractUtils';
import { useFetchBalances } from '../hooks';
import { CreateLockContainer } from '../styles';
import ProjectedVeolas from './ProjectedVeolas';
// import { useCreateLock } from './useCreateLock';

export const GetMoreVeolas = ({ isModalVisible, setIsModalVisible }) => {
  const [form] = Form.useForm();
  const {
    account, chainId, olasBalanceInEth, isMappedAmountZero, getData,
  } = useFetchBalances();
  const cannotCreateLock = !isMappedAmountZero;

  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const amountInEth = Form.useWatch('amount', form);
  const unlockTimeInSeconds = dateInSeconds(Form.useWatch('unlockTime', form));

  // const { write } = useCreateLock();

  useEffect(() => {
    if (account && chainId) {
      getData();
    }
  }, [account, chainId]);

  const createLockHelper = async () => {
    setIsLoading(true);

    const txHash = await createLockRequest({
      amount: parseToWei(form.getFieldValue('amount')),
      unlockTime: parseToSeconds(form.getFieldValue('unlockTime')),
      account,
    });
    notifySuccess('Lock created successfully!', `Transaction Hash: ${txHash}`);

    // fetch the data again to disable button or show message
    getData();

    // close the modal after successful locking & loading state
    setIsModalVisible(false);
    setIsLoading(false);
  };

  const onFinish = async ({ amount }) => {
    try {
      await form.validateFields();
      const hasSufficientTokens = await hasSufficientTokensRequest({
        account,
        chainId,
        amount,
      });
      // const hasSufficientTokens = true;

      // Approve can be clicked only once. Meaning, the user
      // will approve the maximum token, and no need to do it again.
      // Hence, if user has sufficient tokens, create lock without approval
      if (hasSufficientTokens) {
        await createLockHelper();
        // await write();
      } else {
        setIsApproveModalVisible(true);
      }
    } catch (error) {
      window.console.error(error);
      notifyError();
      setIsLoading(false);
    }
  };

  return (
    <CreateLockContainer>
      {isModalVisible && (
        <Modal
          title="Lock OLAS for veOLAS"
          open={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            name="create-lock-form"
            onFinish={onFinish}
          >
            <div className="mb-12">
              <FormItemInputNumber />
              <MaxButton
                onMaxClick={() => {
                  form.setFieldsValue({ amount: olasBalanceInEth });
                  form.validateFields(['amount']);
                }}
              />
            </div>

            <FormItemDate />

            <ProjectedVeolas
              olasLockInEthUnits={amountInEth}
              unlockTimeInSeconds={unlockTimeInSeconds}
            />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!account || cannotCreateLock}
                loading={isLoading}
                className="mr-12"
              >
                Lock
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Form.Item>
          </Form>

          {!account && (
            <Alert message="To add, first connect wallet" type="warning" />
          )}

          {cannotCreateLock && (
            <Alert
              message="Amount already locked, please wait until the lock expires."
              type="warning"
            />
          )}
        </Modal>
      )}

      {isApproveModalVisible && (
        <Modal
          title="Approve veOlas"
          open={isApproveModalVisible}
          footer={null}
          onCancel={() => setIsApproveModalVisible(false)}
        >
          <Alert
            message="Before creating a veOLAS lock, an approval for OLAS is required. Please approve to proceed."
            type="warning"
          />

          <br />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await approveOlasByOwner({ account, chainId });
                  setIsApproveModalVisible(false);

                  // once approved, create lock
                  await createLockHelper();
                  setIsLoading(false);
                } catch (error) {
                  window.console.error(error);
                  setIsApproveModalVisible(false);
                  notifyError();
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Approve
            </Button>
          </div>
        </Modal>
      )}
    </CreateLockContainer>
  );
};

GetMoreVeolas.propTypes = {
  isModalVisible: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
};

GetMoreVeolas.defaultProps = {
  isModalVisible: false,
  setIsModalVisible: () => {},
};
