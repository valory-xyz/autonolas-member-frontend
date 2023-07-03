import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, Form, Modal,
} from 'antd/lib';
import { notifyError, notifySuccess, parseToWei } from 'common-util/functions';
import {
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
  MaxButton,
} from '../../common';
import {
  hasSufficientTokensRequest,
  approveOlasByOwner,
  createLockRequest,
} from '../contractUtils';
import { useFetchBalances } from '../hooks';
import { CreateLockContainer } from '../styles';

export const GetMoreVeolas = ({ isModalVisible, setIsModalVisible }) => {
  const [form] = Form.useForm();
  const {
    account, chainId, olasBalanceInEth, isMappedAmountZero, getData,
  } = useFetchBalances();
  const cannotCreateLock = !isMappedAmountZero;

  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const onFinish = async () => {
    try {
      await form.validateFields();
      const hasSufficientTokens = await hasSufficientTokensRequest({
        account,
        chainId,
      });

      // Approve can be clicked only once. Meaning, the user
      // will approve the maximum token, and no need to do it again.
      // Hence, if user has sufficient tokens, create lock without approval
      if (hasSufficientTokens) {
        await createLockHelper();
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
                disabled={!account || cannotCreateLock}
                loading={isLoading}
                className="mr-12"
              >
                Add To Lock
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
