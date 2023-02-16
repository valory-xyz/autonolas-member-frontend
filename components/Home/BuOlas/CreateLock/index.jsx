import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from 'antd/lib';
import {
  fetchOlasBalance,
  fetchMappedBalances,
  fetchVotesAndTotalSupplyLocked,
} from 'store/setup/actions';
import { notifyError, notifySuccess } from 'common-util/functions';
import { createBuolasLockRequest, approveOlasByOwner } from './utils';
import { CreateLockContainer } from './styles';

const { Title } = Typography;

export const BuolasCreateLock = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isSubmitBtnDisabled = useSelector(
    (state) => !state?.setup?.mappedBalances?.isMappedAmountZero,
  );

  useEffect(() => {
    if (account && chainId) {
      dispatch(fetchOlasBalance());
      dispatch(fetchMappedBalances());
    }
  }, [account, chainId]);

  const onFinish = async () => {
    try {
      await approveOlasByOwner({ account, chainId });

      const txHash = await createBuolasLockRequest({
        account,
        chainId,
      });
      notifySuccess(
        'Lock created successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // fetch the data again to disable button or show message
      dispatch(fetchMappedBalances());
      dispatch(fetchVotesAndTotalSupplyLocked());
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <CreateLockContainer>
      <Title level={3}>Create Lock</Title>

      <Button
        type="primary"
        htmlType="submit"
        disabled={!account || isSubmitBtnDisabled}
        onClick={onFinish}
      >
        Create Lock
      </Button>
    </CreateLockContainer>
  );
};
