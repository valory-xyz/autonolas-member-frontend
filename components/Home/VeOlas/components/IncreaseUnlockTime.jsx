import PropTypes from 'prop-types';
import { Button, Form } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { updateIncreaseUnlockTime } from '../contractUtils';
import { useFetchBalances } from '../hooks';
import { FormContainer } from '../styles';

export const IncreaseUnlockTime = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account, chainId, mappedEndTime, isMappedAmountZero, getData,
  } = useFetchBalances();

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
      getData();

      // close the modal after successful locking
      closeModal();
    } catch (error) {
      window.console.error(error);
      notifyError();
    }
  };

  return (
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
            disabled={!account || isMappedAmountZero}
          >
            Add to lock
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

IncreaseUnlockTime.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
