import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Alert, Button, Form, Typography,
} from 'antd/lib';
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
  fetchCanCreateLock,
  fetchVotes,
  createLockRequest,
} from '../utils';
import { fetchBalanceOfOlas } from '../TestSection/utils';

const { Title } = Typography;

export const CreateLockComponent = ({ account, chainId }) => {
  const [isApproveDisable, setIsApproveDisabled] = useState(true);
  const [isSubmitBtnDisabled, setIsDisabled] = useState(true);
  const [form] = Form.useForm();

  const approveTokenFn = async () => {
    const isTrue = await cannotApproveTokens({ account, chainId });
    setIsApproveDisabled(isTrue);
  };

  useEffect(() => {
    if (account && chainId) {
      const fn = async () => {
        const { canCreateLock } = await fetchCanCreateLock({
          account,
          chainId,
        });
        setIsDisabled(!canCreateLock);

        await approveTokenFn();
      };
      fn();
    }
  }, [account, chainId]);

  const onFinish = async (e) => {
    try {
      await fetchBalanceOfOlas({ account, chainId });
      await fetchVotes({ account, chainId });

      const txHash = await createLockRequest({
        amount: parseAmount(e.amount),
        unlockTime: parseToSeconds(e.unlockTime),
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

      {/* Approve can be clicked only once. Meaning, the user
      will approve the maximum token, and no need to do it again.
      We can test it by calling the allowance method */}
      <Button
        type="primary"
        style={{ marginBottom: '3rem' }}
        disabled={!account || isApproveDisable}
        onClick={async () => {
          await approveOlasByOwner({ account, chainId });

          // button to be disabled once approve is successful
          await approveTokenFn();
        }}
      >
        Approve Max
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
          <Button
            type="primary"
            htmlType="submit"
            disabled={!account || isSubmitBtnDisabled}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      {isSubmitBtnDisabled && (
        <Alert
          message="Amount already locked, please wait until the lock expires."
          type="warning"
        />
      )}
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

/**
 * if already approved => create lock
 * else ask for approval then create lock
 *
 * approval will be checked by `allowance` method
 *
 * https://docs.ethers.org/v5/api/utils/constants/#constants-MaxUint256
 *
 * 1. read test cases - understand about the functionality
 * 2. look at the code - check out the comments
 * 3. look at the documentation
 */

/**
 * I have tried my best to understand about ERC20 and approve method
 * 1. First, we will approve the spender to spend the amount
 * 2. Spender can spend the amount only after the approval
 *
 */
