import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'antd/lib';
import { fetchMappedBalances, fetchVeolasDetails } from 'store/setup/actions';
import {
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
} from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { updateIncreaseUnlockTime } from '../utils';
import { FormContainer } from './styles';

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
      dispatch(fetchVeolasDetails());
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured <IncreaseUnlockTime />');
    }
  };

  return (
    <>
      <FormContainer>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="increase-unlock-time-form"
          onFinish={onFinish}
        >
          <FormItemDate startDate={mappedEndTime} />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!account || cannotIncreaseTime}
            >
              Add to lock
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>

      {cannotIncreaseTime && <CannotIncreaseAlert />}
    </>
  );
};
