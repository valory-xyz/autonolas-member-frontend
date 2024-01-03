import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Form } from 'antd';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';

import { parseToSeconds, FormItemDate, dateInSeconds } from '../../common';
import { updateIncreaseUnlockTime } from '../contractUtils';
import { useFetchBalances, useVeolasComponents } from '../hooks';
import { FormContainer } from '../styles';
import ProjectedVeolas from './ProjectedVeolas';

export const IncreaseUnlockTime = ({ closeModal }) => {
  const [form] = Form.useForm();
  const {
    account, mappedEndTime, isMappedAmountZero, getData, mappedAmount,
  } = useFetchBalances();
  const [isLoading, setIsLoading] = useState(false);

  const { getUnlockTimeComponent } = useVeolasComponents();
  const unlockTimeInSeconds = dateInSeconds(Form.useWatch('unlockTime', form));

  const onFinish = async (e) => {
    try {
      setIsLoading(true);
      const txHash = await updateIncreaseUnlockTime({
        time: parseToSeconds(e.unlockTime),
        account,
      });
      notifySuccess(
        'Unlock time increased successfully!',
        `Transaction Hash: ${txHash}`,
      );

      // once the unlockTime is increased,
      // fetch the newly updated mapped balances & votes.
      getData();

      // close the modal after successful locking & loading state
      closeModal();
      setIsLoading(false);
    } catch (error) {
      window.console.error(error);
      notifyError();
      setIsLoading(false);
    }
  };

  return (
    <FormContainer style={{ marginTop: '1rem' }}>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-unlock-time-form"
        onFinish={onFinish}
      >
        {getUnlockTimeComponent({ hideTitle: true })}
        <Divider />
        <div className="full-width">
          <FormItemDate startDate={mappedEndTime} />
        </div>

        <ProjectedVeolas
          olasLockInEthUnits={mappedAmount}
          unlockTimeInSeconds={unlockTimeInSeconds}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!account || isMappedAmountZero}
            loading={isLoading}
          >
            Increase lock
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

IncreaseUnlockTime.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
