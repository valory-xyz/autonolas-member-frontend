import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'antd/lib';
import { fetchMappedBalances, fetchVeolasDetails } from 'store/setup/actions';
import {
  notifyError,
  notifySuccess,
  CannotIncreaseAlert,
  AlreadyAllAmountLocked,
} from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { updateIncreaseUnlockTime } from '../utils';
import { FormContainer, ModalAlertSection } from './styles';

export const IncreaseUnlockTime = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isMappedAmountZero = useSelector(
    (state) => state?.setup?.mappedBalances?.isMappedAmountZero || false,
  );
  const olasBalance = useSelector((state) => state?.setup?.olasBalance);
  const hasNoOlasBalance = Number(olasBalance || '0') === 0;
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
      <FormContainer style={{ marginTop: '1rem' }}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="increase-unlock-time-form"
          className="custom-vertical-form"
          onFinish={onFinish}
        >
          <div className="full-width">
            <FormItemDate startDate={mappedEndTime} />
          </div>

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

      {account && (
        <ModalAlertSection>
          {isMappedAmountZero && <CannotIncreaseAlert />}
          {hasNoOlasBalance && !isMappedAmountZero && (
            <AlreadyAllAmountLocked />
          )}
        </ModalAlertSection>
      )}
    </>
  );
};
