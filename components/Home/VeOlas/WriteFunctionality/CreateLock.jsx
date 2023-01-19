import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Button, Form, Typography, Modal,
} from 'antd/lib';
import { fetchMappedBalancesFromActions } from 'store/setup/actions';
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
  createLockRequest,
} from '../utils';

const { Title } = Typography;

export const CreateLock = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const mappedAmount = useSelector(
    (state) => state?.setup?.mappedBalances?.amount || 0,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCanCreateLockHelper = async () => {
    fetchMappedBalancesFromActions(account, chainId);
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

  const onFinish = async () => {
    try {
      const hasSufficientTokes = await cannotApproveTokens({
        account,
        chainId,
      });

      // Approve can be clicked only once. Meaning, the user
      // will approve the maximum token, and no need to do it again.
      // Hence, if user has sufficient tokens, create lock without approval
      if (hasSufficientTokes) {
        createLockFn();
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  const isSubmitBtnDisabled = Number(mappedAmount) !== 0;

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

      {isModalOpen && (
        <Modal
          title="Approve veOlas"
          visible={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
        >
          <Alert
            message="Before creating you lock an approval for veOLAS is required, please approve to proceed"
            type="warning"
          />

          <br />
          <Button
            type="primary"
            htmlType="submit"
            style={{ right: 'calc(-100% + 100px)', position: 'relative' }}
            onClick={async () => {
              await approveOlasByOwner({ account, chainId });
              setIsModalOpen(false);

              // once approved, create lock
              createLockFn();
            }}
          >
            Approve
          </Button>
        </Modal>
      )}
    </>
  );
};

/**
 * 1. point out voting power (getVotes)
 *
 * another box below - YOUR VOTING POWER IS - getVotes
 *
 * 2. show message 1 week minimum and 4 years as maximum
 * - fix the calendar
 * - test by sending less than 1 week
 * - test by sending more than 4 years
 *
 * 3. Try to lock with multiple account
 * 4. Increase lock time and lock amount
 *
 * OR
 *
 * 5. Widthdraw once the lock time expires
 *  - maybe another box
 *
 * To test widthdraw, increase the time using ethers.
 * ==> ethers.provider.send("evm_increaseTime", [200]);
 * ==> ethers.provider.send("evm_mine");
 *
 * - ALSO, check with multi-sig (LATER)
 *
 * 7. Try to widthraw before the lock time expires
 */

/*

Modal.info({
title: 'Approve?',
content: (
  <div>
    <Alert
      message="Before creating you lock an approval for veOLAS is required,
      please approve to proceed"
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
})
*/
