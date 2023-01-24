import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import {
  fetchMappedBalances,
  fetchVotesAndTotalSupplyLocked,
} from 'store/setup/actions';
import {
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
} from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { updateIncreaseUnlockTime } from '../utils';

const { Title } = Typography;

export const IncreaseUnlockTime = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const cannotIncreaseTime = useSelector(
    (state) => state?.setup?.mappedBalances?.isMappedAmountZero,
  );
  const mappedEndTime = useSelector(
    (state) => state?.setup?.mappedBalances?.endTime || null,
  );

  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await updateIncreaseUnlockTime({
        time: parseToSeconds(e.unlockTime),
        account,
        chainId,
      });
      notifySuccess(
        'Unlock time increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the unlockTime is increased,
      // fetch the newly updated mapped balances & votes.
      dispatch(fetchMappedBalances());
      dispatch(fetchVotesAndTotalSupplyLocked());
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Increase Unlock Time</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-amount-form"
        onFinish={onFinish}
      >
        <FormItemDate startDate={mappedEndTime} />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!account || cannotIncreaseTime}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      {cannotIncreaseTime && <CannotIncreaseAlert />}
    </>
  );
};
