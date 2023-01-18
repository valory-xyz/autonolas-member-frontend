import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert, Button, Form, Typography,
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
  fetchVotes,
  createLockRequest,
} from '../utils';
import { fetchBalanceOfOlas } from '../TestSection/utils';

const { Title } = Typography;

export const CreateLock = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);

  const [isApproveDisable, setIsApproveDisabled] = useState(true);
  const [isSubmitBtnDisabled, setIsDisabled] = useState(true);
  const [form] = Form.useForm();

  const fetchCanCreateLockHelper = async () => {
    const data = await fetchMapLockedBalances({
      account,
      chainId,
    });
    setIsDisabled(!Number(data.amount) === 0);

    dispatch(setMappedBalances(data));
  };

  const approveTokenHelper = async () => {
    const isTrue = await cannotApproveTokens({ account, chainId });
    setIsApproveDisabled(isTrue);
  };

  useEffect(() => {
    if (account && chainId) {
      const fn = async () => {
        await fetchCanCreateLockHelper();
        await approveTokenHelper();
      };
      fn();
    }
  }, [account, chainId]);

  const onFinish = async (e) => {
    try {
      await fetchBalanceOfOlas({ account, chainId });
      await fetchVotes({ account, chainId });

      const txHash = await createLockRequest({
        amount: parseAmount(e.amount),
        unlockTime: parseToSeconds(e.unlockTime),
        account,
        chainId,
      });
      notifySuccess(
        'Lock created successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // fetch the data again to disable button or show message
      await fetchCanCreateLockHelper();
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      {/* Approve can be clicked only once. Meaning, the user
      will approve the maximum token, and no need to do it again.
      We can test it by calling the allowance method */}
      <Button
        type="primary"
        style={{ marginBottom: '3rem' }}
        disabled={!account || isApproveDisable}
        onClick={async () => {
          await approveOlasByOwner({ account, chainId });

          // button to be disabled once approve is successful
          await approveTokenHelper();
        }}
      >
        Approve Max
      </Button>

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
            disabled={!account || isSubmitBtnDisabled || !isApproveDisable}
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
    </>
  );
};
