import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, Form, Modal, Typography,
} from 'antd/lib';

import { NA } from 'common-util/constants';
import {
  getCommaSeparatedNumber,
  notifyError,
  notifySuccess,
  parseToWei,
} from 'common-util/functions';
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

const { Text } = Typography;

const SECONDS_IN_YEAR = 31536000;

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

  // console.log({ amountInEth, unlockTimeInSeconds });

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

  /**
   * @returns projected veOLAS amount as per the formula.
   * formula = veOLAS = OLAS * lock_time / max_lock_time
   */
  const getProjectedVeolas = (amount, timeInSeconds) => {
    const maxLockTime = SECONDS_IN_YEAR * 4;
    const todayDateInSeconds = new Date().getTime() / 1000;
    const futureMaxLockTime = todayDateInSeconds + maxLockTime; // today's date + 4 years

    const projectedVeolas = (amount * timeInSeconds) / futureMaxLockTime;
    // console.log({
    //   maxLockTime,
    //   todayDateInSeconds,
    //   futureMaxLockTime,
    //   amount,
    //   timeInSeconds,
    //   projectedVeolas,
    // });
    return projectedVeolas.toFixed(2);
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

            <Text type="secondary">
              {`Projected veOLAS amount: ${
                getCommaSeparatedNumber(
                  getProjectedVeolas(amountInEth, unlockTimeInSeconds),
                ) || NA
              }`}
            </Text>

            <Form.Item className="mt-12">
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
