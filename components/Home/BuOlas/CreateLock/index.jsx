import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
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
import { createBuolasLockRequest, approveOlasByOwner } from './utils';
import { CreateLockContainer } from './styles';

const { Title } = Typography;

export const BuolasCreateLock = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const olasBalance = useSelector((state) => state?.setup?.olasBalance);
  const isSubmitBtnDisabled = useSelector(
    (state) => !state?.setup?.mappedBalances?.isMappedAmountZero,
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (account && chainId) {
      dispatch(fetchOlasBalance());
      dispatch(fetchMappedBalances());
    }
  }, [account, chainId]);

  const createLockHelper = async () => {
    await approveOlasByOwner({ account, chainId });

    const txHash = await createBuolasLockRequest({
      amount: parseAmount(form.getFieldValue('amount')),
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
      createLockHelper();
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
        <FormItemInputNumber maxAmount={parseToEth(olasBalance)} />
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
    </CreateLockContainer>
  );
};
