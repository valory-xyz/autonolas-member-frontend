import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Button, Form, Modal, Space,
} from 'antd/lib';
import { notifyError, notifySuccess, parseToWei } from 'common-util/functions';
import {
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
  MaxButton,
} from '../../common';
import {
  cannotApproveTokens,
  approveOlasByOwner,
  createLockRequest,
} from '../contractUtils';
import { useFetchBalances } from '../hooks';
import { CreateLockContainer } from '../styles';

export const AddToLock = () => {
  const [form] = Form.useForm();
  const {
    account, chainId, olasBalanceInEth, canWithdrawVeolas, getData,
  } = useFetchBalances();
  const isSubmitBtnDisabled = useSelector(
    (state) => !state?.setup?.mappedBalances?.isMappedAmountZero,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);

  useEffect(() => {
    if (account && chainId) {
      getData();
    }
  }, [account, chainId]);

  const createLockHelper = async () => {
    const txHash = await createLockRequest({
      amount: parseToWei(form.getFieldValue('amount')),
      unlockTime: parseToSeconds(form.getFieldValue('unlockTime')),
      account,
      chainId,
    });
    notifySuccess('Lock created successfully!', `Transaction Hash: ${txHash}`);

    // fetch the data again to disable button or show message
    getData();

    // close the modal after successful locking
    setIsModalVisible(false);
  };

  const onFinish = async () => {
    try {
      await form.validateFields();
      const hasSufficientTokes = await cannotApproveTokens({
        account,
        chainId,
      });

      // Approve can be clicked only once. Meaning, the user
      // will approve the maximum token, and no need to do it again.
      // Hence, if user has sufficient tokens, create lock without approval
      if (hasSufficientTokes) {
        createLockHelper();
      } else {
        setIsApproveModalVisible(true);
      }
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <CreateLockContainer>
      <Space size="middle">
        <Button
          type="danger"
          disabled={canWithdrawVeolas}
          onClick={() => setIsModalVisible(true)}
        >
          Get more veOLAS
        </Button>

        {canWithdrawVeolas && (
          <Alert
            message="Please claim your OLAS before locking again"
            type="warning"
            showIcon
          />
        )}
      </Space>

      {isModalVisible && (
        <Modal
          title="Add To Lock"
          visible={isModalVisible}
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
            <FormItemInputNumber />
            <MaxButton
              onMaxClick={() => {
                form.setFieldsValue({ amount: olasBalanceInEth });
                form.validateFields(['amount']);
              }}
            />

            <FormItemDate />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!account || isSubmitBtnDisabled}
                className="mr-12"
              >
                Add To Lock
              </Button>

              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Form.Item>
          </Form>

          {isSubmitBtnDisabled && (
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
          visible={isApproveModalVisible}
          footer={null}
          onCancel={() => setIsApproveModalVisible(false)}
        >
          <Alert
            message="Before creating lock an approval for veOLAS is required, please approve to proceed"
            type="warning"
          />

          <br />
          <Button
            type="primary"
            htmlType="submit"
            style={{ right: 'calc(-100% + 100px)', position: 'relative' }}
            onClick={async () => {
              try {
                await approveOlasByOwner({ account, chainId });
                setIsApproveModalVisible(false);

                // once approved, create lock
                await createLockHelper();
              } catch (error) {
                window.console.error(error);
                notifyError('Some error occured');
              }
            }}
          >
            Approve
          </Button>
        </Modal>
      )}
    </CreateLockContainer>
  );
};
