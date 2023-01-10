import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Typography } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import {
  parseAmount,
  parseToSeconds,
  FormItemDate,
  FormItemInputNumber,
} from '../../common';
import { approveOlasByOwner, createLock, fetchCanCreateLock } from '../utils';
import { fetchBalanceOfOlas } from '../TestSection/utils';

const { Title } = Typography;

export const CreateLockComponent = ({ account, chainId }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (account && chainId) {
      const fn = async () => {
        const { cannotCreateLock } = await fetchCanCreateLock({
          account,
          chainId,
        });
        setIsDisabled(cannotCreateLock);
      };
      fn();
    }
  }, [account, chainId]);

  const onFinish = async (e) => {
    try {
      await fetchBalanceOfOlas({ account, chainId });

      const txHash = await createLock({
        amount: parseAmount(e.amount),
        unlockTime: parseToSeconds(e.unlockTime),
        // unlockTime: 93312000,
        account,
        chainId,
      });
      notifySuccess(
        'Lock created successfully!',
        `Transaction Hash: ${txHash}`,
      );
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Create Lock</Title>

      <Button
        type="primary"
        onClick={async () => {
          await approveOlasByOwner({ account, chainId });
        }}
        style={{ marginBottom: '3rem' }}
      >
        Approve 10000000 By Owner
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
          <Button type="primary" htmlType="submit" disabled={isDisabled}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

CreateLockComponent.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

CreateLockComponent.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export const CreateLock = connect(mapStateToProps, null)(CreateLockComponent);
