import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert, Button, Form, Typography, Modal,
} from 'antd/lib';
import { setMappedBalances } from 'store/setup/actions';
import { notifyError, notifySuccess } from 'common-util/functions';
import {
  parseAmount,
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
} from '../../common';
import {
  cannotApproveTokens,
  approveOlasByOwner,
  fetchMapLockedBalances,
  createLockRequest,
} from '../utils';

const { Title } = Typography;

export const CreateLock = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitBtnDisabled, setIsDisabled] = useState(true);
  const [form] = Form.useForm();

  const fetchCanCreateLockHelper = async () => {
    const data = await fetchMapLockedBalances({
      account,
      chainId,
    });
    setIsDisabled(Number(data.amount) !== 0);

    // set the data in redux
    dispatch(setMappedBalances(data));
  };

  useEffect(() => {
    if (account && chainId) {
      const fn = async () => {
        await fetchCanCreateLockHelper();
      };
      fn();
    }
  }, [account, chainId]);

  const createLockFn = async () => {
    const txHash = await createLockRequest({
      amount: parseAmount(form.getFieldValue('amount')),
      unlockTime: parseToSeconds(form.getFieldValue('unlockTime')),
      account,
      chainId,
    });
    notifySuccess('Lock created successfully!', `Transaction Hash: ${txHash}`);

    // fetch the data again to disable button or show message
    await fetchCanCreateLockHelper();
  };

  const onFinish = async (e) => {
    try {
      const hasSufficientTokes = await cannotApproveTokens({
        account,
        chainId,
      });

      // Approve can be clicked only once. Meaning, the user
      // will approve the maximum token, and no need to do it again.
      // Hence, if user has sufficient tokens, create lock without approval
      if (hasSufficientTokes) {
        createLockFn(e.amount, e.unlockTime);
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="create-lock-form"
        onFinish={onFinish}
      >
        <FormItemInputNumber />
        <FormItemDate />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!account || isSubmitBtnDisabled}
          >
            Create Lock
          </Button>
        </Form.Item>
      </Form>

      {isSubmitBtnDisabled && (
        <Alert
          message="Amount already locked, please wait until the lock expires."
          type="warning"
        />
      )}

      {isModalOpen
        && Modal.info({
          title: 'Approve?',
          content: (
            <div>
              <Alert
                message="Before creating you lock an approval for veOLAS is required, please approve to proceed"
                type="warning"
              />
            </div>
          ),
          okText: 'Approve',
          onOk: async () => {
            await approveOlasByOwner({ account, chainId });
            setIsModalOpen(false);

            // once approved, create lock
            createLockFn();
          },
          visible: isModalOpen,
          onCancel: () => setIsModalOpen(false),
        })}
    </>
  );
};
