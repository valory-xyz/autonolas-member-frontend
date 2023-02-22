import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert, Button, Form, Typography, Modal, Checkbox,
} from 'antd/lib';
import {
  fetchOlasBalance,
  fetchMappedBalances,
  fetchVotesAndTotalSupplyLocked,
} from 'store/setup/actions';
import { parseToEth, notifyError, notifySuccess } from 'common-util/functions';
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
import { CreateLockContainer } from './styles';

const { Title } = Typography;

export const VeolasCreateLock = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const olasBalance = useSelector((state) => state?.setup?.olasBalance);
  const isSubmitBtnDisabled = useSelector(
    (state) => !state?.setup?.mappedBalances?.isMappedAmountZero,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canLockMaxAmount, setCheckMaxAmount] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (account && chainId) {
      dispatch(fetchOlasBalance());
      dispatch(fetchMappedBalances());
    }
  }, [account, chainId]);

  const onCheckboxChange = (e) => {
    setCheckMaxAmount(e.target.checked);
  };

  const createLockHelper = async () => {
    const txHash = await createLockRequest({
      amount: canLockMaxAmount
        ? olasBalance
        : parseAmount(form.getFieldValue('amount')),
      unlockTime: parseToSeconds(form.getFieldValue('unlockTime')),
      account,
      chainId,
    });
    notifySuccess('Lock created successfully!', `Transaction Hash: ${txHash}`);

    // fetch the data again to disable button or show message
    dispatch(fetchMappedBalances());
    dispatch(fetchVotesAndTotalSupplyLocked());
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
        setIsModalOpen(true);
      }
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <CreateLockContainer>
      <Title level={3}>Create Lock</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="create-lock-form"
        onFinish={onFinish}
      >
        <FormItemInputNumber
          isRequired={!canLockMaxAmount}
          maxAmount={parseToEth(olasBalance)}
        />
        <Form.Item>
          <Checkbox checked={canLockMaxAmount} onChange={onCheckboxChange}>
            Lock maximum amount
          </Checkbox>
        </Form.Item>
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
            message="Before creating lock an approval for veOLAS is required, please approve to proceed"
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
              await createLockHelper();
            }}
          >
            Approve
          </Button>
        </Modal>
      )}
    </CreateLockContainer>
  );
};
